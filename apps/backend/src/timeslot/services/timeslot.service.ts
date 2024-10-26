import { Injectable } from '@nestjs/common';

import { TimeslotModel } from '../models/timeslot.model';
import { ITimeslotCreationParams } from '../types/timeslot-creation.params.type';
import { TimeslotDBUtil } from '../utils/timeslot-db.util';

@Injectable()
export class TimeslotService {
  constructor(private readonly timeslotDBUtil: TimeslotDBUtil) {}

  async createTimeslot(
    params: ITimeslotCreationParams,
  ): Promise<TimeslotModel> {
    const { company, endHour, endMinute, startHour, startMinute } = params;

    return await this.timeslotDBUtil.createTimeslot({
      company,
      endHour,
      endMinute,
      startHour,
      startMinute,
    });
  }

  async getAllTimeslot(params?: { includeDeleted?: boolean }) {
    const includeDeleted = params?.includeDeleted ?? false;

    const timeslotArray = await this.timeslotDBUtil.getAll({
      withDeleted: includeDeleted,
    });

    return timeslotArray;
  }
}
