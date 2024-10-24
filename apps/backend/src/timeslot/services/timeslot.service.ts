import { Injectable } from '@nestjs/common';

import { TimeslotModel } from '../models/timeslot.model';
import { TimeslotDBUtil } from '../utils/timeslot-db.util';

@Injectable()
export class TimeslotService {
  constructor(private readonly timeslotDBUtil: TimeslotDBUtil) {}

  async createTimeslot(timeslot: TimeslotModel): Promise<TimeslotModel> {
    return await this.timeslotDBUtil.createTimeslot({
      timeslot,
    });
  }
}
