import { randomUUID } from 'crypto';

import { JobType } from '../enums/job-type.enum';
import { IMessageBody } from '../types/queue.type';

export class MessageBody<T> implements IMessageBody<T> {
  date: string;
  message: T;
  messageId: string;
  messageAttribute: { job: { dataType: string; value: string } };

  constructor(message: T, jobType: JobType) {
    this.date = new Date().toISOString();
    this.messageId = randomUUID();
    this.message = message;
    this.messageAttribute = {
      job: {
        dataType: 'string',
        value: jobType,
      },
    };
  }
}
