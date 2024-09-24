import { SQS } from '@aws-sdk/client-sqs';
import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SqsProducerOptions } from '@ssut/nestjs-sqs/dist/sqs.types';
import { randomBytes } from 'crypto';
import { DataSource } from 'typeorm';
import { CommonModule } from './common/common.module';
import { EnvironmentVariableUtil } from './common/utils/environment-variable.util';
import DatabaseConfig from './database/database.config';
import { QueueUtil } from './queue-producer/utils/queue.util';

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

  public static sqsModule = SqsModule.registerAsync({
    imports: [CommonModule],
    inject: [EnvironmentVariableUtil],
    useFactory: (envVarUtil: EnvironmentVariableUtil) => {
      const LOG_KEY = 'SetupSqsModule';
      const logger = new Logger(LOG_KEY);

      logger.log('Start setting up SQS Module');

      const envVars = envVarUtil.getVariables();

      const queueUrl = envVars.sqsUrl;
      const region = envVars.sqsAwsRegion;
      const queueNames = QueueUtil.getQueueNames();
      const sqsClient = new SQS({
        region: envVars.sqsAwsRegion,
        credentials: {
          accessKeyId: envVars.sqsAwsAccessKey,
          secretAccessKey: envVars.sqsAwsSecretAccessKey,
        },
      });

      const producers = Object.values(queueNames).map<SqsProducerOptions>(
        (value) => ({
          name: value,
          queueUrl,
          region,
          sqs: sqsClient,
        }),
      );

      return {
        producers,
        logger,
      };
    },
  });
}
