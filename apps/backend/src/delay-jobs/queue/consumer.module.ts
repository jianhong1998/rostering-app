import { Module } from '@nestjs/common';
import { EmailQueueConsumerService } from './services/email-consumer.service';
import { sqsProvider } from './provider/sqs-provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [sqsProvider, EmailQueueConsumerService],
  exports: [sqsProvider, EmailQueueConsumerService],
})
export class QueueConsumerModule {}
