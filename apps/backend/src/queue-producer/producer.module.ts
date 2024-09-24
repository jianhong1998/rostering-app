import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailQueueProducerService } from './services/email-producer.service';
import { sqsProvider } from './provider/sqs-provider';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [EmailQueueProducerService, sqsProvider],
  exports: [EmailQueueProducerService],
})
export class QueueProducerModule {}
