import { IsString } from 'class-validator';

export class VerifyTokenReqBodyDTO {
  @IsString()
  token: string;
}
