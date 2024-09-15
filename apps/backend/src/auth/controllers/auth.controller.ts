import { Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { TokenUtil } from '../utils/token.util';

@Controller('/auth')
export class AuthController {
  constructor(private readonly tokenUtil: TokenUtil) {}

  @Post('/')
  @Public()
  async loggin() {
    const payload = {
      userId: '1234-abcd-5678',
    };

    const tokenData = await this.tokenUtil.generateToken(payload);

    return tokenData;
  }
}
