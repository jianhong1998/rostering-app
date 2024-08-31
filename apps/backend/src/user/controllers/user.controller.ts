import { Controller, Get } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  @Get('/')
  public async getAllUsers() {
    return await this.userService.getAll({ entityManager: this.entityManager });
  }
}
