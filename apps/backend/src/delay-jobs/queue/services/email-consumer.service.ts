import { Injectable, Logger } from '@nestjs/common';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
// import { QueueName } from '../enums/queue-name.enum';
import { Message } from '@aws-sdk/client-sqs';
import { QueueUtil } from '../utils/queue.util';

@Injectable()
export class EmailQueueConsumerService {
  logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  @SqsMessageHandler(QueueUtil.getQueueNames().emailQueue, false)
  async messageHandler(message: Message) {
    if (!message.Body) {
      this.logger.error(
        `Message body not found for message ${message.MessageId}`,
      );
    }

    const messageBody = JSON.parse(message.Body);

    console.log(messageBody);
  }

  @SqsConsumerEventHandler(
    QueueUtil.getQueueNames().emailQueue,
    'processing_error',
  )
  async errorHandler(error: Error, _: Message) {
    this.logger.error(error);
  }
}
