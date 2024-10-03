import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { EnvironmentVariableUtil } from 'src/common/utils/environment-variable.util';
import { LoggerUtil } from 'src/common/utils/logger.util';

import { IQueueMessage } from '../types/queue.type';

@Injectable()
export class SqsProvider {
  private sqsClient: SQSClient;
  private envVarList: ReturnType<EnvironmentVariableUtil['getVariables']>;

  constructor(
    private readonly envVarUtil: EnvironmentVariableUtil,
    private readonly loggerUtil: LoggerUtil,
  ) {
    this.envVarList = envVarUtil.getVariables();
  }

  public getSqsClient(): SQSClient {
    if (this.sqsClient) return this.sqsClient;

    this.sqsClient = new SQSClient({
      region: this.envVarList.sqsAwsRegion,
      useQueueUrlAsEndpoint: true,
    });

    return this.sqsClient;
  }

  public async send(message: IQueueMessage): Promise<void> {
    const client = this.getSqsClient();
    const logger = this.loggerUtil.createLogger('SQS_SendMessage');

    const {
      body,
      queueUrl,
      delaySeconds,
      messageAttributes,
      messageDeduplicationId,
    } = message;

    logger.log('Sending message to SQS');

    try {
      const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: body,
        MessageAttributes: messageAttributes,
        MessageDeduplicationId: messageDeduplicationId,
        DelaySeconds: delaySeconds,
      });
      const response = await client.send(command);

      logger.log(JSON.stringify({ response }));
    } catch (error) {
      logger.error('Failed to send message to SQS!');
      throw error;
    }
  }
}
