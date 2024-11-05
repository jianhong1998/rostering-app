import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from 'src/common/decorators';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { CompanyModel } from 'src/company/models/company.model';
import { UserModel } from 'src/user/models/user.model';
import { EntityManager } from 'typeorm';

import {
  CreateTimeslotReqDTO,
  CreateTimeslotResDTO,
} from '../dto/create-timeslot.dto';
import { GetAllTimeslotsResDTO } from '../dto/get-timeslot.dto';
import { TimeslotModel } from '../models/timeslot.model';
import { WeekdayTimeslotModel } from '../models/weekday-timeslot.model';
import { TimeslotService } from '../services/timeslot.service';
import { WeekdayTimeslotService } from '../services/weekday-timeslot.service';

@Controller('/timeslot')
export class TimeslotController {
  constructor(
    private readonly timeslotService: TimeslotService,
    private readonly weekdayTimeslotService: WeekdayTimeslotService,
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly loggerUtil: LoggerUtil,
  ) {}

  @Get('/')
  async getAllTimeslot(
    @User() user: UserModel,
    @Query('weekday') weekdayQuery?: number,
  ) {
    const companyId = user.company?.uuid;

    if (!companyId) throw new Error('User has no company');

    let timeslots: TimeslotModel[];
    let weekdayTimeslots: WeekdayTimeslotModel[];

    if (weekdayQuery) {
      weekdayTimeslots =
        await this.weekdayTimeslotService.getAllWeekdayTimeslotsByWeekday({
          companyId,
          weekdayNumber: weekdayQuery,
        });

      timeslots = weekdayTimeslots
        .map((weekdayTimeslot) => weekdayTimeslot.timeslot)
        .filter((timeslot) => typeof timeslot !== 'undefined');
    } else {
      timeslots = await this.timeslotService.getAllTimeslot({
        condition: {
          company: {
            uuid: companyId,
          },
        },
      });
    }

    if (!timeslots.length) {
      return new GetAllTimeslotsResDTO(timeslots, []);
    }

    const getWeekdayTimeslotsPromises = [] as Promise<WeekdayTimeslotModel[]>[];

    for (const timeslot of timeslots) {
      const promise =
        this.weekdayTimeslotService.getAllWeekdayTimeslotsByTimeslotId({
          timeslotId: timeslot.uuid,
        });
      getWeekdayTimeslotsPromises.push(promise);
    }

    weekdayTimeslots = (await Promise.all(getWeekdayTimeslotsPromises)).flat();

    return new GetAllTimeslotsResDTO(timeslots, weekdayTimeslots);
  }

  @Post('/')
  async createNewTimeslot(
    @Body() createTimeslotBody: CreateTimeslotReqDTO,
    @User('company') company: CompanyModel,
  ) {
    const logger = this.loggerUtil.createLogger('CreateNewTimeslotController');
    const { endHour, endMinute, startHour, startMinute, weekdays } =
      createTimeslotBody;

    const { timeslot, weekdayTimeslots } = await this.manager.transaction(
      async (manager) => {
        const newTimeslot = await this.timeslotService.createTimeslot({
          startHour,
          startMinute,
          endHour,
          endMinute,
          company,
          manager,
        });

        const weekdayTimeslots =
          await this.weekdayTimeslotService.createWeekdayTimeslot({
            savedTimeslot: newTimeslot,
            weekdays,
            manager,
          });

        return {
          weekdayTimeslots,
          timeslot: newTimeslot,
        };
      },
    );

    logger.log(
      `Timeslot (${timeslot.uuid}) and its WeekdayTimeslot records are created.`,
    );

    return new CreateTimeslotResDTO(timeslot, weekdayTimeslots);
  }
}
