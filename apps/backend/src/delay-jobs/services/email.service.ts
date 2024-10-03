import { SES } from '@aws-sdk/client-ses';
import * as ClientSES from '@aws-sdk/client-ses';
import { createTransport, Transporter } from 'nodemailer';

import { IEventBody, IEventInfo } from '../types/event.type';
import { DelayJobLogger } from '../utils/delay-job-logger.util';

export class EmailService {
  public transporter: Transporter;
  public logger: DelayJobLogger;

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

    this.logger = new DelayJobLogger('Email Service');
  }

  public static async handleSendEmail(eventInfo: IEventInfo): Promise<void> {
    const eventBody = JSON.parse(eventInfo.body) as IEventBody;
    const instance = this.getInstance();

    instance.logger.log(`Sending email to ${eventBody.message.to}`);
    await instance.transporter.sendMail(eventBody.message);
    instance.logger.log(`Email is sent to ${eventBody.message.to}`);
  }

  private static getInstance(): EmailService {
    if (this.instance) return this.instance;

    this.instance = new EmailService();
    return this.instance;
  }
}
