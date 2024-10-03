import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { TokenUtil } from '../utils/token.util';
import { Response } from 'express';
import { UserDBUtil } from 'src/user/utils/userDB.util';
import { randomUUID } from 'crypto';
import { EnvironmentVariableUtil } from 'src/common/utils/environment-variable.util';
import { AuthService } from '../services/auth.service';
import { LoginReqBody } from '../dto/req-body/login-req-body.dto';
import { LoggerUtil } from 'src/common/utils/logger.util';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly tokenUtil: TokenUtil,
    private readonly userDbUtil: UserDBUtil,
    private readonly envVarUtil: EnvironmentVariableUtil,
    private readonly authService: AuthService,
    private readonly loggerUtil: LoggerUtil,
  ) {}

  @Post('/')
  @Public()
  async login(@Body() body: LoginReqBody, @Res() res: Response) {
    const logger = this.loggerUtil.createLogger('LoginFunction');

    const { email } = body;

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

    logger.log('Sending queue message to email queue...', 'LoginFunction');
    await this.authService.login();
    logger.log('Queue message is sent to email queue', 'LoginFunction');

    res.cookie('token', tokenData.token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.send(tokenData);
  }
}
