import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { MessageAttributeDataType } from '../enums/message-attribute-data-type.enum';

import { JobType } from '../enums/job-type.enum';
import { MessageBody } from '../models/message-body.model';
import { IQueueMessage } from '../types/queue.type';
import { SqsProvider } from '../provider/sqs-provider';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailQueueProducerService {
  private queueUrl: string;

  constructor(
    configService: ConfigService,
    private readonly sqsProvider: SqsProvider,
  ) {
    const queueUrl = configService.get('AWS_SQS_URL') ?? '';
    this.queueUrl = queueUrl;
  }

  async sendMessageToQueue(message: Mail.Options) {
    const messageId = randomUUID();
    const messageBody = new MessageBody(message, JobType.SEND_EMAIL);
    const queueMessage: IQueueMessage = {
      queueUrl: this.queueUrl,
      body: JSON.stringify(messageBody),
      messageAttributes: {
        jobType: {
          DataType: MessageAttributeDataType.STRING,
          StringValue: JobType.SEND_EMAIL,
        },
        messageId: {
          DataType: MessageAttributeDataType.STRING,
          StringValue: messageId,
        },
      },
    };

    await this.sqsProvider.send(queueMessage);
  }
}
