import { Module } from '@nestjs/common';
import { TokenUtil } from './utils/token.util';
import { AuthGuardService } from './services/auth.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [TokenUtil, AuthGuardService],
  controllers: [],
  exports: [TokenUtil, AuthGuardService],
})
export class AuthModule {}
