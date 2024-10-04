import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { QueueProducerModule } from 'src/queue-producer/producer.module';
import { UserModule } from 'src/user/user.module';

import { AuthController } from './controllers/auth.controller';
import { TempAuthTokenModel } from './models/temp-auth-token.model';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { TempTokenService } from './services/temp-token.service';
import { TokenUtil } from './utils/token.util';

@Module({
  imports: [
    UserModule,
    CommonModule,
    QueueProducerModule,
    TypeOrmModule.forFeature([TempAuthTokenModel]),
  ],
  providers: [TokenUtil, AuthGuardService, AuthService, TempTokenService],
  controllers: [AuthController],
  exports: [TokenUtil, AuthGuardService],
})
export class AuthModule {}
