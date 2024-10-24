import { Controller, Get, Post } from '@nestjs/common';

@Controller('/timeslot')
export class TimeslotController {
  @Get('/')
  async getAllTimeslot() {}

  @Post('/')
  async createNewTimeslot() {}
}
