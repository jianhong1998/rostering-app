import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TimeslotModel } from './models/timeslot.model';

@Module({
  imports: [TypeOrmModule.forFeature([TimeslotModel])],
  providers: [],
  controllers: [],
  exports: [],
})
export class TimeslotModule {}
