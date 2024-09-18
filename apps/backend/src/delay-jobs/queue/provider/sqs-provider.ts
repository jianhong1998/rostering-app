import { Provider } from '@nestjs/common';
import { SQS, SQSClientConfig } from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';

export const sqsProvider: Provider = {
  provide: SQS,
  useFactory: (configService: ConfigService) => {
    const region = configService.get<string>('AWS_REGION') ?? '';
    const accessKeyId = configService.get<string>('AWS_ACCESS_KEY_ID') ?? '';
    const secretAccessKey = configService.get<string>('AWS_SECRET_ACCESS_KEY');

    const sqsConfig: SQSClientConfig = {
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    };

    return new SQS(sqsConfig);
  },
  inject: [ConfigService],
};
