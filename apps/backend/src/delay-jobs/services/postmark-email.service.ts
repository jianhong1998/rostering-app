import { ServerClient } from 'postmark';

import { environmentVariables } from '../constants';
import { IEventBody, IEventInfo } from '../types/event.type';
import { DelayJobLogger } from '../utils/delay-job-logger.util';

export class PostmarkEmailService {
  public client: ServerClient;
  public logger: DelayJobLogger;

  private static instance: PostmarkEmailService;

  constructor() {
    this.client = new ServerClient(environmentVariables.postmarkServerToken);
    this.logger = new DelayJobLogger('Postmark Email Service');
  }

  public static async handleSendEmail(eventInfo: IEventInfo): Promise<void> {
    const instance = this.getInstance();

    const eventBody = JSON.parse(eventInfo.body) as IEventBody;
    const {
      message: { to, from, replyTo, subject, html },
    } = eventBody;

    instance.logger.log(`Sending email to ${eventBody.message.to}`);

    await instance.client.sendEmail({
      From: from.toString() ?? '',
      ReplyTo: replyTo.toString() ?? '',
      Subject: subject ?? '',
      To: to.toString() ?? '',
      HtmlBody: String(html),
    });

    instance.logger.log(`Email is sent to ${eventBody.message.to}`);
  }

  private static getInstance(): PostmarkEmailService {
    if (!this.instance) this.instance = new PostmarkEmailService();

    return this.instance;
  }
}
