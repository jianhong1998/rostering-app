import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerUtil } from 'src/common/utils/logger.util';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { TimeslotModel } from '../models/timeslot.model';
import { WeekdayTimeslotModel } from '../models/weekday-timeslot.model';

@Injectable()
export class WeekdayTimeslotDBUtil {
  constructor(
    @InjectRepository(WeekdayTimeslotModel)
    private readonly weekdayTimeslotRepo: Repository<WeekdayTimeslotModel>,
    private readonly loggerUtil: LoggerUtil,
  ) {}

  public async createWeekdayTimeslotForTimeslot(params: {
    savedTimeslot: TimeslotModel;
    weekdays: number[];
    manager?: EntityManager;
  }): Promise<WeekdayTimeslotModel[]> {
    const LOG_KEY = 'CreateWeekdayTimeslotForTimeslot';
    const INTERNAL_SERVER_ERROR_MESSAGE =
      'Failed to create weekday timeslot for timeslot';
    const logger = this.loggerUtil.createLogger(LOG_KEY);

    const { savedTimeslot, weekdays, manager } = params;

    if (!savedTimeslot) {
      logger.error(`Invalid savedTimeslot: ${savedTimeslot}`);
      throw new Error(INTERNAL_SERVER_ERROR_MESSAGE);
    }

    if (!savedTimeslot.uuid) {
      logger.error(
        `Timeslot is not saved before passed in as UUID is undefined or null.`,
      );
      throw new Error(INTERNAL_SERVER_ERROR_MESSAGE);
    }

    if (!weekdays) {
      logger.error(`Invalid weekdays: ${weekdays}`);
      throw new Error(INTERNAL_SERVER_ERROR_MESSAGE);
    }

    if (!weekdays.length) {
      logger.error(`No weekday number is received.`);
      throw new BadRequestException(
        'No weekday is choosed. Please choose at least 1 weekday.',
      );
    }

    const repo =
      manager?.getRepository(WeekdayTimeslotModel) ?? this.weekdayTimeslotRepo;
    const weekdayTimeslots = [];

    weekdays.forEach((weekdayNumber) => {
      const weekdayTimeslot = new WeekdayTimeslotModel();

      weekdayTimeslot.timeslot = savedTimeslot;
      weekdayTimeslot.weekdayNumber = weekdayNumber;

      weekdayTimeslots.push(weekdayTimeslot);
    });

    return await repo.save(weekdayTimeslots);
  }

  public async getAll(params: {
    condition?: FindOptionsWhere<WeekdayTimeslotModel>;
    relations?: FindOptionsRelations<WeekdayTimeslotModel>;
    manager?: EntityManager;
    withDeleted?: boolean;
  }): Promise<WeekdayTimeslotModel[]> {
    const { condition, manager, relations, withDeleted } = params;

    if (typeof withDeleted === 'undefined' || withDeleted === null) {
      params.withDeleted = false;
    }

    const repo =
      manager?.getRepository(WeekdayTimeslotModel) ?? this.weekdayTimeslotRepo;

    return await repo.find({
      where: condition,
      relations,
      withDeleted: params.withDeleted,
    });
  }
}
