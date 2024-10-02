import Mail from 'nodemailer/lib/mailer';
import { IEmailParam } from './email-param.type';

export interface IEmailGenerator<EmailParams extends object> {
  sendEmail: () => Promise<void>;
  generateEmailOptions: (params: IEmailParam<EmailParams>) => Mail.Options;
}
