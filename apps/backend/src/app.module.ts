import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfig } from './app.config';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { AuthGuardService } from './auth/services/auth-guard.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { QueueProducerModule } from './delay-jobs/queue/producer.module';

@Module({
  imports: [
    AppConfig.configModule,
    AppConfig.typeormModule,
    AppConfig.jwtModule,
    AppConfig.sqsModule,
    CommonModule,
    UserModule,
    AuthModule,
    QueueProducerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuardService,
    },
  ],
})
export class AppModule {}
