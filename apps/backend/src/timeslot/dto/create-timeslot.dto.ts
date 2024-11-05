import { IsArray, IsInt, IsNumber, IsString } from 'class-validator';

import { TimeslotModel } from '../models/timeslot.model';
import { WeekdayTimeslotModel } from '../models/weekday-timeslot.model';

export class CreateTimeslotReqDTO {
  @IsInt()
  startHour: number;

  @IsInt()
  startMinute: number;

  @IsInt()
  endHour: number;

  @IsInt()
  endMinute: number;

  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  weekdays: number[];
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

  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  onWeekdays: number[];

  constructor(
    timeslot: TimeslotModel,
    weekdayTimeslots: WeekdayTimeslotModel[],
  ) {
    this.uuid = timeslot.uuid;
    this.startHour = timeslot.startHour;
    this.startMinute = timeslot.startMinute;
    this.endHour = timeslot.endHour;
    this.endMinute = timeslot.endMinute;
    this.onWeekdays = weekdayTimeslots.map(
      (weekdayTimeslot) => weekdayTimeslot.weekdayNumber,
    );
  }
}
