import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { TimeslotModel } from '../models/timeslot.model';
import { ITimeslotCreationParams } from '../types/timeslot-creation.params.type';

@Injectable()
export class TimeslotDBUtil {
  constructor(
    @InjectRepository(TimeslotModel)
    private readonly timeslotRepo: Repository<TimeslotModel>,
  ) {}

  public async createTimeslot(
    params: ITimeslotCreationParams & { manager?: EntityManager },
  ): Promise<TimeslotModel> {
    const { company, endHour, endMinute, startHour, startMinute, manager } =
      params;

    const timeslot = new TimeslotModel();
    timeslot.startHour = startHour;
    timeslot.startMinute = startMinute;
    timeslot.endHour = endHour;
    timeslot.endMinute = endMinute;
    timeslot.company = company;

    const repo = manager?.getRepository(TimeslotModel) ?? this.timeslotRepo;

    const saved = await repo.save([timeslot]);

    return saved[0];
  }

  public async getAll(params: {
    condition?: FindOptionsWhere<TimeslotModel>;
    relations?: FindOptionsRelations<TimeslotModel>;
    manager?: EntityManager;
    withDeleted?: boolean;
  }): Promise<TimeslotModel[]> {
    const { condition, manager, relations, withDeleted } = params;
    const repo = manager?.getRepository(TimeslotModel) ?? this.timeslotRepo;

    if (typeof withDeleted === 'undefined' || withDeleted === null) {
      params.withDeleted = false;
    }

    return await repo.find({
      where: condition,
      relations,
      withDeleted: params.withDeleted,
    });
  }
}
