import { Controller, Post, Res } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { TokenUtil } from '../utils/token.util';
import { Response } from 'express';
import { UserDBUtil } from 'src/user/utils/userDB.util';
import { randomUUID } from 'crypto';
import { EnvironmentVariableUtil } from 'src/common/utils/environment-variable.util';
import { AuthService } from '../services/auth.service';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly tokenUtil: TokenUtil,
    private readonly userDbUtil: UserDBUtil,
    private readonly envVarUtil: EnvironmentVariableUtil,
    private readonly authService: AuthService,
  ) {}

  @Post('/')
  @Public()
  async loggin(@Res() res: Response) {
    const users = await this.userDbUtil.getAll({
      relation: {
        account: false,
      },
    });

    const randomUser = users[0];

    const payload = {
      userId: randomUser?.uuid ?? randomUUID(),
    };

    const tokenData = await this.tokenUtil.generateToken(payload);

    await this.authService.login();

    res.cookie('token', tokenData.token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.send(tokenData);
  }
}
