import { Module } from '@nestjs/common';
import { TokenUtil } from './utils/token.util';
import { AuthGuardService } from './services/auth-guard.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './controllers/auth.controller';
import { CommonModule } from 'src/common/common.module';
import { AuthService } from './services/auth.service';
import { QueueProducerModule } from 'src/delay-jobs/queue/producer.module';

@Module({
  imports: [UserModule, CommonModule, QueueProducerModule],
  providers: [TokenUtil, AuthGuardService, AuthService],
  controllers: [AuthController],
  exports: [TokenUtil, AuthGuardService],
})
export class AuthModule {}
