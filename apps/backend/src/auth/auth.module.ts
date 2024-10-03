import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { QueueProducerModule } from 'src/queue-producer/producer.module';
import { UserModule } from 'src/user/user.module';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { TokenUtil } from './utils/token.util';

@Module({
  imports: [UserModule, CommonModule, QueueProducerModule],
  providers: [TokenUtil, AuthGuardService, AuthService],
  controllers: [AuthController],
  exports: [TokenUtil, AuthGuardService],
})
export class AuthModule {}
