import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './controllers/user.controller';
import { AccountModel } from './models/account.model';
import { UserModel } from './models/user.model';
import { UserService } from './services/user.service';
import { UserDBUtil } from './utils/userDB.util';
@Module({
  imports: [TypeOrmModule.forFeature([UserModel, AccountModel])],
  providers: [UserDBUtil, UserService],
  controllers: [UserController],
  exports: [UserService, UserDBUtil],
})
export class UserModule {}
