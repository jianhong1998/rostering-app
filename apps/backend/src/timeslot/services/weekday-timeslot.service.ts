import { BadRequestException, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { EntityManager } from 'typeorm';

import { TimeslotModel } from '../models/timeslot.model';
import { WeekdayTimeslotModel } from '../models/weekday-timeslot.model';
import { WeekdayTimeslotDBUtil } from '../utils/weekday-timeslot-db.util';
import { WeekdayValidationUtil } from '../utils/weekday-validation.util';

@Injectable()
export class WeekdayTimeslotService {
  constructor(
    private readonly weekdayTimeslotDBUtil: WeekdayTimeslotDBUtil,
    private readonly weekdayValidationUtil: WeekdayValidationUtil,
  ) {}

  public async createWeekdayTimeslot(params: {
    savedTimeslot: TimeslotModel;
    weekdays: number[];
    manager?: EntityManager;
  }) {
    const { savedTimeslot, manager, weekdays } = params;

    if (!savedTimeslot.uuid) throw new Error('Timeslot is not saved yet.');

    for (const weekday of weekdays) {
      if (!this.weekdayValidationUtil.isValidWeekdayNumber(weekday))
        throw new BadRequestException(`Invalid weekday: ${weekday}`);
    }

    const weekdayTimeslots =
      await this.weekdayTimeslotDBUtil.createWeekdayTimeslotForTimeslot({
        savedTimeslot,
        weekdays,
        manager,
      });

    return weekdayTimeslots;
  }

  public async getAllWeekdayTimeslotsByTimeslotId(params: {
    timeslotId: string;
    manager?: EntityManager;
    withDeleted?: boolean;
  }): Promise<WeekdayTimeslotModel[]> {
    const { timeslotId, manager, withDeleted } = params;

    if (!timeslotId || !isUUID(timeslotId)) {
      throw new Error(`Invalid timeslotId: ${timeslotId}`);
    }

    if (typeof withDeleted === 'undefined' || withDeleted === null) {
      params.withDeleted = false;
    }

    const weekdayTimeslots = await this.weekdayTimeslotDBUtil.getAll({
      manager,
      condition: {
        timeslot: {
          uuid: timeslotId,
        },
      },
      relations: {
        timeslot: true,
      },
      withDeleted: params.withDeleted,
    });

    return weekdayTimeslots;
  }

  public async getAllWeekdayTimeslotsByWeekday(params: {
    weekdayNumber: number;
    companyId: string;
    manager?: EntityManager;
  }): Promise<WeekdayTimeslotModel[]> {
    const { companyId, weekdayNumber, manager } = params;

    const weekdayTimeslots = await this.weekdayTimeslotDBUtil.getAll({
      condition: {
        timeslot: {
          company: {
            uuid: companyId,
          },
        },
        weekdayNumber,
      },
      manager,
      relations: {
        timeslot: true,
      },
    });

    return weekdayTimeslots;
  }
}
