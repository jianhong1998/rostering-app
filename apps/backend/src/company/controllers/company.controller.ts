import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import {
  CreateCompanyReqDTO,
  CreateCompanyResDTO,
} from '../dto/create-company.dto';
import { CompanyService } from '../services/company.service';

@Controller('/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('/')
  public async getAllCompany(
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    const includeDeletedCompanies = includeDeleted ?? false;

    const companies = await this.companyService.getAllCompanies(
      includeDeletedCompanies,
    );

    return companies;
  }

  @Post('/')
  public async createCompany(
    @Body() reqBody: CreateCompanyReqDTO,
  ): Promise<CreateCompanyResDTO> {
    const { name: companyName } = reqBody;

    return await this.companyService.createCompany(companyName);
  }
}
