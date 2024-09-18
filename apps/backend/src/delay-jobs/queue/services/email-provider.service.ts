import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { SqsService } from '@ssut/nestjs-sqs';
import { MessageGroupId } from '../enums/message-group-id.enum';
import { MessageAttributeDataType } from '../enums/message-attribute-data-type.enum';
import { IMessageBody, IQueueMessage } from '../types/queue.type';
import { QueueUtil } from '../utils/queue.util';
import { JobType } from '../enums/job-type.enum';

@Injectable()
export class QueueProducerService {
  private queueUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly sqsServivce: SqsService,
  ) {
    const queueUrl = configService.get('SQS_URL') ?? '';
    this.queueUrl = queueUrl;
  }

  async send(
    message: string,
    jobType: JobType,
    messageGroupId: MessageGroupId,
  ) {
    if (!Object.keys(JobType).includes(jobType as unknown as string)) {
      throw new BadRequestException('Invalid Job Type.');
    }

    const messageId = randomUUID();
    const messageBody: IMessageBody = {
      date: new Date().toISOString(),
      messageId,
      message,
      messageAttribute: {
        job: {
          dataType: 'string',
          value: jobType,
        },
      },
    };
    const queueMessage: IQueueMessage = {
      id: messageId,
      queueUrl: this.queueUrl,
      body: JSON.stringify(messageBody),
      messageGroupId,
      messageAttributes: {
        job: {
          DataType: MessageAttributeDataType.STRING,
          StringValue: jobType,
        },
      },
    };

    await this.sqsServivce.send(
      QueueUtil.getQueueNames().emailQueue,
      queueMessage,
    );
  }
}
