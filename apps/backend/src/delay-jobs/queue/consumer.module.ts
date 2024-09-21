import { Module } from '@nestjs/common';
import { EmailQueueConsumerService } from './services/email-consumer.service';
import { sqsProvider } from './provider/sqs-provider';

@Module({
  imports: [],
  controllers: [],
  providers: [sqsProvider, EmailQueueConsumerService],
  exports: [EmailQueueConsumerService],
})
export class QueueConsumerModule {}
