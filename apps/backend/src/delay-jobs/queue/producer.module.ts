import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { sqsProvider } from './provider/sqs-provider';
import { EmailQueueProducerService } from './services/email-producer.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [sqsProvider, EmailQueueProducerService],
  exports: [sqsProvider, EmailQueueProducerService],
})
export class QueueProducerModule {}
