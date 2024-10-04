import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';

import { SqsProvider } from './provider/sqs-provider';
import { EmailQueueProducerService } from './services/email-producer.service';

@Module({
  imports: [ConfigModule, CommonModule],
  controllers: [],
  providers: [EmailQueueProducerService, SqsProvider],
  exports: [EmailQueueProducerService],
})
export class QueueProducerModule {}
