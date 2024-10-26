import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountType } from 'src/user/enums/account-type';
import { UserModel } from 'src/user/models/user.model';
import { UserDBUtil } from 'src/user/utils/userDB.util';

import { TokenUtil } from '../utils/token.util';
import { TempTokenService } from './temp-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userDBUtil: UserDBUtil,
    private readonly tokenUtil: TokenUtil,
    private readonly tempTokenService: TempTokenService,
  ) {}

  public async findLoginUserByEmail(
    email: string,
  ): Promise<{ user: UserModel | null }> {
    const user = await this.userDBUtil.getOne({
      criterial: {
        account: {
          email,
          accountType: AccountType.EMAIL,
        },
      },
      relation: {
        account: true,
      },
    });

    return { user };
  }

  public async getActualToken(tempTokenId: string) {
    const user = await this.tempTokenService.extractDataFromToken({
      tokenId: tempTokenId,
    });

    if (!user)
      throw new UnauthorizedException('Invalid token or token expired');

    const payload = {
      userId: user.uuid,
    };

    const { hashedSecret, token } = await this.tokenUtil.generateToken(payload);

    await this.tempTokenService.deleteTempToken({ tokenId: tempTokenId });

    return { hashedSecret, token };
  }

  public async verifyToken(token: string): Promise<boolean> {
    return this.tokenUtil.verifyTokenWithoutSecret(token);
  }
}
