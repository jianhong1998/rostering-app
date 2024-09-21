import { Module } from '@nestjs/common';
import { QueueConsumerModule } from './queue/consumer.module';
import { QueueProducerModule } from './queue/producer.module';
import { AppConfig } from '../app.config';

@Module({
  imports: [
    AppConfig.sqsProducerModule,
    AppConfig.sqsConsumerModule,
    AppConfig.configModule,
    QueueConsumerModule,
    QueueProducerModule,
  ],
})
export class DelayJobModule {}
