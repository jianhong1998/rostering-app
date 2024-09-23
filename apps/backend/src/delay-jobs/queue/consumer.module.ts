import { Module } from '@nestjs/common';
import { EmailQueueConsumerService } from './services/email-consumer.service';
import { ConfigModule } from '@nestjs/config';
import { sqsProvider } from './provider/sqs-provider';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [EmailQueueConsumerService, sqsProvider],
  exports: [EmailQueueConsumerService],
})
export class QueueConsumerModule {}
