import { Injectable } from '@nestjs/common';

@Injectable()
export class WeekdayValidationUtil {
  isValidWeekdayNumber(weekdayNumber: number): boolean {
    return (
      !Number.isNaN(weekdayNumber) && weekdayNumber >= 1 && weekdayNumber <= 7
    );
  }
}
