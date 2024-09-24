import { Injectable } from '@nestjs/common';
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
      // credentials: {
      //   accessKeyId: envVars.sqsAwsAccessKey,
      //   secretAccessKey: envVars.sqsAwsSecretAccessKey,
      // },
    });

    return this.sqsClient;
  }

  public async send(message: IQueueMessage): Promise<void> {
    const client = this.getSqsClient();

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

    console.log(JSON.stringify({ command }));

    await client.send(command);
  }
}
