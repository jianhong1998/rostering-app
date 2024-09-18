import { Module } from '@nestjs/common';
import { UserDBUtil } from './utils/userDB.util';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './models/user.model';
import { AccountModel } from './models/account.model';
@Module({
  imports: [TypeOrmModule.forFeature([UserModel, AccountModel])],
  providers: [UserDBUtil, UserService],
  controllers: [UserController],
  exports: [UserService, UserDBUtil],
})
export class UserModule {}
