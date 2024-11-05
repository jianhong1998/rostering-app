import { Injectable } from '@nestjs/common';
import { EntityManager, FindOptionsWhere } from 'typeorm';

import { TimeslotModel } from '../models/timeslot.model';
import { ITimeslotCreationParams } from '../types/timeslot-creation-params.type';
import { TimeslotDBUtil } from '../utils/timeslot-db.util';

@Injectable()
export class TimeslotService {
  constructor(private readonly timeslotDBUtil: TimeslotDBUtil) {}

  async createTimeslot(
    params: ITimeslotCreationParams & { manager?: EntityManager },
  ): Promise<TimeslotModel> {
    const { company, endHour, endMinute, startHour, startMinute, manager } =
      params;

    const timeslot = await this.timeslotDBUtil.createTimeslot({
      company,
      endHour,
      endMinute,
      startHour,
      startMinute,
      manager,
    });

    return timeslot;
  }

  async getAllTimeslot(params?: {
    condition?: FindOptionsWhere<TimeslotModel>;
    includeDeleted?: boolean;
  }) {
    const includeDeleted = params?.includeDeleted ?? false;

    const timeslotArray = await this.timeslotDBUtil.getAll({
      condition: params?.condition,
      withDeleted: includeDeleted,
    });

    return timeslotArray;
  }
}
