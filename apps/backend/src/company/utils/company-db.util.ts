import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CompanyModel } from '../models/company.model';

@Injectable()
export class CompanyDBUtil {
  constructor(
    @InjectRepository(CompanyModel)
    private readonly companyRepo: Repository<CompanyModel>,
  ) {}

  public async create(params: {
    companyName: string;
    manager?: EntityManager;
  }): Promise<CompanyModel> {
    const { companyName, manager } = params;
    const repo = manager?.getRepository(CompanyModel) ?? this.companyRepo;

    const company = new CompanyModel();
    company.name = companyName;

    const savedCompany = await repo.save(company);

    return savedCompany;
  }

  public async getAll(params?: {
    condition?: FindOptionsWhere<CompanyModel>;
    relation?: FindOptionsRelations<CompanyModel>;
    manager?: EntityManager;
    includeDeleted?: boolean;
  }): Promise<CompanyModel[]> {
    const repo =
      params?.manager?.getRepository(CompanyModel) ?? this.companyRepo;

    const companies = await repo.find({
      where: params?.condition,
      relations: params?.relation,
      withDeleted: params?.includeDeleted ?? false,
    });

    return companies;
  }

  public async get(params: {
    condition: FindOptionsWhere<CompanyModel>;
    relation?: FindOptionsRelations<CompanyModel>;
    manager?: EntityManager;
    includeDeleted?: boolean;
  }): Promise<CompanyModel | null> {
    const { condition, manager, relation, includeDeleted } = params;
    const repo = manager?.getRepository(CompanyModel) ?? this.companyRepo;

    const company = await repo.findOne({
      where: condition,
      relations: relation,
      withDeleted: includeDeleted ?? false,
    });

    return company;
  }

  public async count(params?: {
    condition?: FindOptionsWhere<CompanyModel>;
    manager?: EntityManager;
  }): Promise<number> {
    const repo =
      params?.manager?.getRepository(CompanyModel) ?? this.companyRepo;

    return await repo.count({
      where: params?.condition,
    });
  }

  public async has(params?: {
    condition?: FindOptionsWhere<CompanyModel>;
    manager?: EntityManager;
  }): Promise<boolean> {
    const countResult = await this.count({
      condition: params?.condition,
      manager: params?.manager,
    });

    return countResult > 0;
  }
}
