import { Module } from '@nestjs/common';
import { UserDBUtil } from './utils/userDB.util';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './models/user.model';
@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [UserDBUtil, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
