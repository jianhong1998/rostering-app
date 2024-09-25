import { Injectable, Logger } from '@nestjs/common';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { EnvironmentVariableUtil } from 'src/common/utils/environment-variable.util';
import { IQueueMessage } from '../types/queue.type';

@Injectable()
export class SqsProvider {
  private sqsClient: SQSClient;

  constructor(private readonly envVarUtil: EnvironmentVariableUtil) {}

  public getSqsClient(): SQSClient {
    if (this.sqsClient) return this.sqsClient;

    const envVars = this.envVarUtil.getVariables();

    this.sqsClient = new SQSClient({
      region: envVars.sqsAwsRegion,
      credentials: {
        accessKeyId: envVars.sqsAwsAccessKey,
        secretAccessKey: envVars.sqsAwsSecretAccessKey,
      },
      logger: console,
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
