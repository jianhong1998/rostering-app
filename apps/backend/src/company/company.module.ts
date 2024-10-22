import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyController } from './controllers/company.controller';
import { CompanyModel } from './models/company.model';
import { CompanyService } from './services/company.service';
import { CompanyDBUtil } from './utils/company-db.util';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyModel])],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyDBUtil],
  exports: [CompanyService, CompanyDBUtil],
})
export class CompanyModule {}
