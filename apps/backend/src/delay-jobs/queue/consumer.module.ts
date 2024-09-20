import { Module } from '@nestjs/common';
import { EmailQueueConsumerService } from './services/email-consumer.service';

@Module({
  imports: [],
  controllers: [],
  providers: [EmailQueueConsumerService],
  exports: [EmailQueueConsumerService],
})
export class QueueConsumerModule {}
