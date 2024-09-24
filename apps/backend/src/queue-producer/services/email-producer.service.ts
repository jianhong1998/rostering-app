import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SqsService } from '@ssut/nestjs-sqs';
import { randomUUID } from 'crypto';
import { MessageAttributeDataType } from '../enums/message-attribute-data-type.enum';
import { MessageGroupId } from '../enums/message-group-id.enum';

import { JobType } from '../enums/job-type.enum';
import { MessageBody } from '../models/message-body.model';
import { IQueueMessage } from '../types/queue.type';
import { QueueUtil } from '../utils/queue.util';

@Injectable()
export class EmailQueueProducerService {
  private queueUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly sqsServivce: SqsService,
  ) {
    const queueUrl = configService.get('AWS_SQS_URL') ?? '';
    this.queueUrl = queueUrl;
  }

  async sendMessageToQueue<T>(
    message: T,
    jobType: JobType,
    messageGroupId: MessageGroupId,
  ) {
    if (!Object.keys(JobType).includes(jobType as unknown as string)) {
      throw new BadRequestException('Invalid Job Type.');
    }

    const messageId = randomUUID();
    const messageBody = new MessageBody(message, jobType);
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
