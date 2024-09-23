import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
import { Message } from '@aws-sdk/client-sqs';
import { QueueUtil } from '../utils/queue.util';
import { MessageBody } from '../models/message-body.model';
import { QueueErrorHandler } from '../middleware/queue-error-handler.interceptor';

@Injectable()
export class EmailQueueConsumerService {
  logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  @SqsMessageHandler(QueueUtil.getQueueNames().emailQueue, false)
  @UseInterceptors(QueueErrorHandler)
  async messageHandler(message: Message) {
    this.logger.log('Service Running', 'QueueMessage');
    console.log('Service Running');

    if (!message.Body) {
      this.logger.error(
        `Message body not found for message ${message.MessageId}`,
      );
    }

    const messageBody = JSON.parse(message.Body) as MessageBody<{
      emailAddress: string;
      emailMessage: string;
    }>;

    this.logger.log({
      messageBody,
      email: {
        address: messageBody.message.emailAddress,
        message: messageBody.message.emailMessage,
      },
    });
  }

  @SqsConsumerEventHandler(
    QueueUtil.getQueueNames().emailQueue,
    'processing_error',
  )
  async errorHandler(error: Error, _: Message) {
    this.logger.error(error);
  }
}
