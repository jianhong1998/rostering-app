import { Controller, Logger, Post, Res } from '@nestjs/common';
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
  async login(@Res() res: Response) {
    Logger.log('Before userDbUtil.getAll()', 'LoginFunction');
    const users = await this.userDbUtil.getAll({
      relation: {
        account: false,
      },
    });
    Logger.log('After userDbUtil.getAll()', 'LoginFunction');

    const randomUser = users[0];

    const payload = {
      userId: randomUser?.uuid ?? randomUUID(),
    };

    Logger.log('Before tokenUtil.generateToken()', 'LoginFunction');
    const tokenData = await this.tokenUtil.generateToken(payload);
    Logger.log('After tokenUtil.generateToken()', 'LoginFunction');

    Logger.log('Before authService.login()', 'LoginFunction');
    await this.authService.login();
    Logger.log('After authService.login()', 'LoginFunction');

    res.cookie('token', tokenData.token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.send(tokenData);
  }
}
