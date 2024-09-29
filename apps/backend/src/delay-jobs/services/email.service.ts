import { createTransport, Transporter } from 'nodemailer';
import { IEventBody, IEventInfo } from '../types/event.type';
import { SES } from '@aws-sdk/client-ses';
import * as ClientSES from '@aws-sdk/client-ses';

export class EmailService {
  public transporter: Transporter;

  private static instance: EmailService;

  private constructor() {
    const region = process.env.SES_AWS_REGION;
    const ses = new SES({
      region,
    });

    this.transporter = createTransport({
      SES: {
        ses,
        aws: ClientSES,
      },
    });
  }

  public static async handleSendEmail(eventInfo: IEventInfo): Promise<void> {
    const eventBody = JSON.parse(eventInfo.body) as IEventBody;

    const result = await this.getInstance().transporter.sendMail(
      eventBody.message,
    );

    console.log(`Message sent: ${result.messageId}`);
  }

  private static getInstance(): EmailService {
    if (this.instance) return this.instance;

    this.instance = new EmailService();
    return this.instance;
  }
}
