import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfig } from './app.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [AppConfig.configModule, AppConfig.typeormModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
