import { IsInt, IsString } from 'class-validator';

import { TimeslotModel } from '../models/timeslot.model';

export class CreateTimeslotReqDTO {
  @IsInt()
  startHour: number;

  @IsInt()
  startMinute: number;

  @IsInt()
  endHour: number;

  @IsInt()
  endMinute: number;
}

export class CreateTimeslotResDTO {
  @IsString()
  uuid: string;

  @IsInt()
  startHour: number;

  @IsInt()
  startMinute: number;

  @IsInt()
  endHour: number;

  @IsInt()
  endMinute: number;

  constructor(timeslot: TimeslotModel) {
    this.uuid = timeslot.uuid;
    this.startHour = timeslot.startHour;
    this.startMinute = timeslot.startMinute;
    this.endHour = timeslot.endHour;
    this.endMinute = timeslot.endMinute;
  }
}
