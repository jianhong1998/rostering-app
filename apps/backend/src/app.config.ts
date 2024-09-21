import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseConfig from './database/database.config';
import { DataSource } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { SqsModule } from '@ssut/nestjs-sqs';
import {
  SqsConsumerOptions,
  SqsProducerOptions,
} from '@ssut/nestjs-sqs/dist/sqs.types';
import { QueueUtil } from './delay-jobs/queue/utils/queue.util';
import { CommonModule } from './common/common.module';
import { EnvironmentVariableUtil } from './common/utils/environment-variable.util';

export class AppConfig {
  private constructor() {}

  public static configModule = ConfigModule.forRoot({
    envFilePath: ['.env'],
    cache: false,
    isGlobal: true,
  });

  public static typeormModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      DatabaseConfig.getConfig(configService),
    dataSourceFactory: async (options) =>
      await new DataSource(options).initialize(),
  });

  public static jwtModule = JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    global: true,
    useFactory: (configService: ConfigService) => ({
      secret:
        configService.get('JWT_SECRET') ?? randomBytes(16).toString('hex'),
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRE') ?? '15 mins',
      },
    }),
  });

  public static sqsProducerModule = SqsModule.registerAsync({
    imports: [CommonModule],
    inject: [EnvironmentVariableUtil],
    useFactory: (envVarUtil: EnvironmentVariableUtil) => {
      const envVars = envVarUtil.getVariables();

      const queueUrl = envVars.sqsUrl;
      const region = envVars.awsRegion;
      const queueNames = QueueUtil.getQueueNames();

      const producers = Object.entries(queueNames).map(
        ([_, value]): SqsProducerOptions => ({
          name: value,
          queueUrl,
          region,
        }),
      );

      return {
        producers,
      };
    },
  });

  public static sqsConsumerModule = SqsModule.registerAsync({
    imports: [CommonModule],
    inject: [EnvironmentVariableUtil],
    useFactory: (envVarUtil: EnvironmentVariableUtil) => {
      const envVars = envVarUtil.getVariables();

      const queueUrl = envVars.sqsUrl;
      const region = envVars.awsRegion;
      const queueNames = QueueUtil.getQueueNames();

      const consumers = Object.entries(queueNames).map(
        ([_, value]): SqsConsumerOptions => ({
          name: value,
          queueUrl,
          region,
          attributeNames: ['All'],
        }),
      );

      return {
        consumers,
      };
    },
  });
}
