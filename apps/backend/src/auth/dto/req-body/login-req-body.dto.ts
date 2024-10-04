import { IsEmail } from 'class-validator';

export class LoginReqBody {
  @IsEmail()
  email: string;
}
