import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addMinutes } from 'date-fns';
import { UserModel } from 'src/user/models/user.model';
import { EntityManager, IsNull, MoreThan, Not, Repository } from 'typeorm';

import { TempAuthTokenModel } from '../models/temp-auth-token.model';

@Injectable()
export class TempTokenService {
  constructor(
    @InjectRepository(TempAuthTokenModel)
    private readonly tokenRepo: Repository<TempAuthTokenModel>,
  ) {}

  public async generateTempToken(params: {
    user: UserModel;
    manager?: EntityManager;
  }): Promise<string> {
    const { user, manager } = params;

    // Delete existing tokens
    const existingTokens = await this.getUserExistingTempToken({
      user,
      manager,
    });
    const deleteTokenPromises = existingTokens.map((tempToken) =>
      this.deleteTempToken({ tokenId: tempToken.uuid, manager }),
    );
    await Promise.all(deleteTokenPromises);

    const token = await this.createTempToken({ user, manager });
    return token;
  }

  public async extractDataFromToken(params: {
    tokenId: string;
    manager?: EntityManager;
  }): Promise<UserModel | null> {
    const { tokenId, manager } = params;
    const repo = manager?.getRepository(TempAuthTokenModel) ?? this.tokenRepo;

    const tempToken = await repo.findOne({
      where: {
        uuid: tokenId,
        expiredAt: MoreThan(new Date()),
        user: Not(IsNull()),
      },
      relations: {
        user: true,
      },
    });

    if (!tempToken) return null;

    return tempToken.user!;
  }

  public async deleteTempToken(params: {
    tokenId: string;
    manager?: EntityManager;
  }): Promise<void> {
    const { tokenId, manager } = params;
    const repo = manager?.getRepository(TempAuthTokenModel) ?? this.tokenRepo;

    const tempToken = await repo.findOne({
      where: {
        uuid: tokenId,
      },
    });

    if (!tempToken) return;

    await repo.softRemove(tempToken);
  }

  private async getUserExistingTempToken(params: {
    user: UserModel;
    manager: EntityManager;
  }): Promise<TempAuthTokenModel[]> {
    const { manager, user } = params;

    const repo = manager?.getRepository(TempAuthTokenModel) ?? this.tokenRepo;

    const tempTokens = repo.find({
      where: {
        user,
      },
    });

    return tempTokens;
  }

  private async createTempToken(params: {
    user: UserModel;
    manager?: EntityManager;
  }) {
    const { user, manager } = params;
    const repo = manager?.getRepository(TempAuthTokenModel) ?? this.tokenRepo;

    const tempToken = new TempAuthTokenModel();
    tempToken.user = user;
    tempToken.expiredAt = addMinutes(new Date(), 5);

    const savedToken = await repo.save(tempToken);

    return savedToken.uuid;
  }
}
