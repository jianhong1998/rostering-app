import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { CompanyModel } from '../models/company.model';

export class CreateCompanyReqDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateCompanyResDTO {
  @IsUUID()
  uuid: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(company: CompanyModel) {
    this.uuid = company.uuid;
    this.name = company.name;
  }
}
