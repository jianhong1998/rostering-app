import { IsArray } from 'class-validator';

import { TimeslotModel } from '../models/timeslot.model';
import { WeekdayTimeslotModel } from '../models/weekday-timeslot.model';

type TimeslotData = {
  uuid: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  onWeekdays: number[];
};

export class GetAllTimeslotsResDTO {
  @IsArray()
  public data: Array<TimeslotData>;

  constructor(
    timeslots: TimeslotModel[],
    weekdayTimeslots: WeekdayTimeslotModel[],
  ) {
    const map = new Map<string, number[]>();

    weekdayTimeslots.forEach((weekdayTimeslot) => {
      // Should be timeslot UUID instead of weekdayTimeslot UUID
      const timeslotUuid = weekdayTimeslot.timeslot?.uuid ?? '';
      if (!timeslotUuid) return;

      if (map.has(timeslotUuid)) {
        map.get(timeslotUuid).push(weekdayTimeslot.weekdayNumber);
      } else {
        map.set(timeslotUuid, [weekdayTimeslot.weekdayNumber]);
      }
    });

    const dataArray = [] as Array<TimeslotData>;

    timeslots.forEach((timeslot) => {
      dataArray.push({
        uuid: timeslot.uuid,
        startHour: timeslot.startHour,
        startMinute: timeslot.startMinute,
        endHour: timeslot.endHour,
        endMinute: timeslot.endMinute,
        onWeekdays: map.get(timeslot.uuid) ?? [],
      });
    });

    this.data = dataArray;
  }
}
