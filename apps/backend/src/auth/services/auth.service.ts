import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EmailQueueProducerService } from 'src/queue-producer/services/email-producer.service';
import { AccountType } from 'src/user/enums/account-type';
import { UserDBUtil } from 'src/user/utils/userDB.util';

import { TokenUtil } from '../utils/token.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly QueueProducerService: EmailQueueProducerService,
    private readonly userDBUtil: UserDBUtil,
    private readonly tokenUtil: TokenUtil,
  ) {}

  public async login(email: string) {
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

    if (!user) throw new UnauthorizedException('Email is not registered.');

    const payload = {
      userId: user.uuid,
    };

    const { hashedSecret, token } = await this.tokenUtil.generateToken(payload);

    return { user, hashedSecret, token };
  }
}
