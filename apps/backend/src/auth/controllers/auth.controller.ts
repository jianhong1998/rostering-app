import { Controller, Post, Res } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { TokenUtil } from '../utils/token.util';
import { Response } from 'express';
import { randomUUID } from 'crypto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly tokenUtil: TokenUtil) {}

  @Post('/')
  @Public()
  async loggin(@Res() res: Response) {
    const payload = {
      userId: randomUUID(),
    };

    const tokenData = await this.tokenUtil.generateToken(payload);

    res.cookie('token', tokenData.token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.send(tokenData);
  }
}
