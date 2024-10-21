import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyModel } from './models/company.model';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyModel])],
  controllers: [],
  providers: [],
  exports: [],
})
export class CompanyModule {}
