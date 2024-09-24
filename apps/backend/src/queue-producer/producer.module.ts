import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailQueueProducerService } from './services/email-producer.service';
import { SqsProvider } from './provider/sqs-provider';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [ConfigModule, CommonModule],
  controllers: [],
  providers: [EmailQueueProducerService, SqsProvider],
  exports: [EmailQueueProducerService],
})
export class QueueProducerModule {}
