import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDBUtil } from '../utils/userDB.util';
import { EntityManager, FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(private readonly userDBUtil: UserDBUtil) {}

  public async getOne(params: {
    searchCredential: FindOptionsWhere<UserModel>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<UserModel>;
  }) {
    const { searchCredential, entityManager, relation } = params;
    const user = await this.userDBUtil.getOne({
      criterial: searchCredential,
      entityManager,
      relation,
    });

    if (!user) throw new NotFoundException('User not found.');

    return { user };
  }

  public async getAll(params?: {
    searchCredential?: FindOptionsWhere<UserModel>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<UserModel>;
  }) {
    const users = await this.userDBUtil.getAll({
      credential: params?.searchCredential,
      entityManager: params?.entityManager,
      relation: params?.relation,
    });

    return users;
  }
}
