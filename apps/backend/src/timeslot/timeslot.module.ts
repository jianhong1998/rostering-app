import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';

import { TimeslotController } from './controllers/timeslot.controller';
import { TimeslotModel } from './models/timeslot.model';
import { WeekdayTimeslotModel } from './models/weekday-timeslot.model';
import { TimeslotService } from './services/timeslot.service';
import { WeekdayTimeslotService } from './services/weekday-timeslot.service';
import { TimeslotDBUtil } from './utils/timeslot-db.util';
import { WeekdayTimeslotDBUtil } from './utils/weekday-timeslot-db.util';
import { WeekdayValidationUtil } from './utils/weekday-validation.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeslotModel, WeekdayTimeslotModel]),
    CommonModule,
  ],
  providers: [
    TimeslotService,
    TimeslotDBUtil,
    WeekdayTimeslotDBUtil,
    WeekdayTimeslotService,
    WeekdayValidationUtil,
  ],
  controllers: [TimeslotController],
  exports: [
    TimeslotService,
    TimeslotDBUtil,
    WeekdayTimeslotDBUtil,
    WeekdayTimeslotService,
  ],
})
export class TimeslotModule {}
