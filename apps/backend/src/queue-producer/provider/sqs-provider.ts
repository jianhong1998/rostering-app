import { Injectable, Logger } from '@nestjs/common';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { EnvironmentVariableUtil } from 'src/common/utils/environment-variable.util';
import { IQueueMessage } from '../types/queue.type';

@Injectable()
export class SqsProvider {
  private sqsClient: SQSClient;

  constructor(private readonly envVarUtil: EnvironmentVariableUtil) {}

  private getLogger(logKey?: string) {
    const logger = new Logger(logKey);

    return {
      debug: (message: unknown) => {
        if (typeof message === 'object') {
          logger.debug(JSON.stringify(message));
        } else {
          logger.debug(String(message));
        }
      },
      info: (message: unknown) => {
        if (typeof message === 'object') {
          logger.log(JSON.stringify(message));
        } else {
          logger.log(String(message));
        }
      },
      warn: (message: unknown) => {
        if (typeof message === 'object') {
          logger.warn(JSON.stringify(message));
        } else {
          logger.warn(String(message));
        }
      },
      error: (message: unknown) => {
        if (typeof message === 'object') {
          logger.error(JSON.stringify(message));
        } else {
          logger.error(String(message));
        }
      },
    };
  }

  public getSqsClient(): SQSClient {
    if (this.sqsClient) return this.sqsClient;
    const logger = this.getLogger('SQS_Client');

    const envVars = this.envVarUtil.getVariables();

    this.sqsClient = new SQSClient({
      region: envVars.sqsAwsRegion,
      credentials: {
        accessKeyId: envVars.sqsAwsAccessKey,
        secretAccessKey: envVars.sqsAwsSecretAccessKey,
      },
      logger,
      useQueueUrlAsEndpoint: true,
    });

    return this.sqsClient;
  }

  public async send(message: IQueueMessage): Promise<void> {
    const client = this.getSqsClient();
    const logger = new Logger('SQS_SendMessage');

    const {
      body,
      queueUrl,
      delaySeconds,
      messageAttributes,
      messageDeduplicationId,
    } = message;

    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: body,
      MessageAttributes: messageAttributes,
      MessageDeduplicationId: messageDeduplicationId,
      DelaySeconds: delaySeconds,
    });

    logger.log(JSON.stringify({ command }));

    const response = await new Promise((resolve, reject) => {
      client.send(command, (error, data) => {
        if (error) return reject(error);
        resolve(data);
      });
    });

    logger.log(JSON.stringify({ response }));
  }
}
