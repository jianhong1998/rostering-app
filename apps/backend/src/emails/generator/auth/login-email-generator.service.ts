import Mail from 'nodemailer/lib/mailer';
import { IEmailParam } from 'src/emails/types/email-param.type';
import { BaseEmailGenerator } from '../base-email-generator';
import { IEmailGenerator } from 'src/emails/types/email-generator.type';

interface ILoginEmailParams extends Record<string, string> {
  name: string;
  expireDateTime: string;
  loginUrl: string;
}

export class LoginEmailGenerator
  extends BaseEmailGenerator
  implements IEmailGenerator<ILoginEmailParams>
{
  constructor() {
    const templateFileName = 'login-email.template.html';
    const generatorId = 'LoginEmail';
    const paramList = ['name', 'expireDateTime', 'loginUrl'];
    const emailSubjectTemplate = 'Login';

    super({ emailSubjectTemplate, generatorId, paramList, templateFileName });
  }

  public generateEmailOptions(
    params: IEmailParam<ILoginEmailParams>,
  ): Mail.Options {
    const {
      addresses: { from, to, replyTo },
      params: emailParams,
    } = params;

    const { emailBody, subject } = this.generateEmailContent(emailParams);

    return {
      to,
      from,
      replyTo,
      subject,
      html: emailBody,
    };
  }

  public async sendEmail() {}
}
