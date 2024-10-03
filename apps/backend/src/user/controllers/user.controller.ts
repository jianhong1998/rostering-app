import { Controller, Get } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { UserService } from '../services/user.service';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  @Get('/')
  public async getAllUsers() {
    return await this.userService.getAll({
      entityManager: this.entityManager,
      relation: { account: true },
    });
  }
}
