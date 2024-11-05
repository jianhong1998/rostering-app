import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DefaultAvailabilityModel } from './models/default-availability.model';

@Module({
  imports: [TypeOrmModule.forFeature([DefaultAvailabilityModel])],
  providers: [],
  controllers: [],
  exports: [],
})
export class EmployeeAvailabilityModule {}
