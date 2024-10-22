import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CreateCompanyResDTO } from '../dto/create-company.dto';
import { CompanyDBUtil } from '../utils/company-db.util';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyDBUtil: CompanyDBUtil,
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  public async createCompany(companyName: string) {
    const isSameNameCompanyExist = await this.companyDBUtil.has({
      condition: {
        name: companyName,
      },
    });

    if (isSameNameCompanyExist) {
      throw new ConflictException(
        'Company name is used. Please enter another company name.',
      );
    }

    await this.companyDBUtil.create({
      companyName,
    });

    const createdCompany = await this.companyDBUtil.get({
      condition: { name: companyName },
    });

    if (!createdCompany)
      throw new InternalServerErrorException('Failed to create company.');

    return new CreateCompanyResDTO(createdCompany);
  }

  public async getAllCompanies(includeDeleted?: boolean) {
    return await this.companyDBUtil.getAll({
      includeDeleted,
    });
  }
}
