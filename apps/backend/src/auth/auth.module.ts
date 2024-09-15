import { Module } from '@nestjs/common';
import { TokenUtil } from './utils/token.util';
import { AuthGuardService } from './services/auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './controllers/auth.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [UserModule, CommonModule],
  providers: [TokenUtil, AuthGuardService],
  controllers: [AuthController],
  exports: [TokenUtil, AuthGuardService],
})
export class AuthModule {}
