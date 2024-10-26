import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/common/decorators';
import { CompanyModel } from 'src/company/models/company.model';

import {
  CreateTimeslotReqDTO,
  CreateTimeslotResDTO,
} from '../dto/create-timeslot.dto';
import { TimeslotService } from '../services/timeslot.service';

@Controller('/timeslot')
export class TimeslotController {
  constructor(private readonly timeslotService: TimeslotService) {}

  @Get('/')
  async getAllTimeslot() {
    /**@todo Add filter by user company*/

    return await this.timeslotService.getAllTimeslot();
  }

  @Post('/')
  async createNewTimeslot(
    @Body() createTimeslotBody: CreateTimeslotReqDTO,
    @User('company') company: CompanyModel,
  ) {
    const { endHour, endMinute, startHour, startMinute } = createTimeslotBody;

    const newTimeslot = await this.timeslotService.createTimeslot({
      startHour,
      startMinute,
      endHour,
      endMinute,
      company,
    });

    return new CreateTimeslotResDTO(newTimeslot);
  }
}
