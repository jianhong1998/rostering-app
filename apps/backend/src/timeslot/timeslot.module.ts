import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TimeslotController } from './controllers/timeslot.controller';
import { TimeslotModel } from './models/timeslot.model';
import { TimeslotService } from './services/timeslot.service';
import { TimeslotDBUtil } from './utils/timeslot-db.util';

@Module({
  imports: [TypeOrmModule.forFeature([TimeslotModel])],
  providers: [TimeslotService, TimeslotDBUtil],
  controllers: [TimeslotController],
  exports: [TimeslotService, TimeslotDBUtil],
})
export class TimeslotModule {}
