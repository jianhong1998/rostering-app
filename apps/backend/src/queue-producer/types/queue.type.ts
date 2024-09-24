import { MessageAttributeValue } from '@aws-sdk/client-sqs';
import { MessageAttributeDataType } from '../enums/message-attribute-data-type.enum';
import { JobType } from '../enums/job-type.enum';

type IQueueJob = {
  dataType: string;
  value: string;
};

type IMessageAttribute = {
  job: IQueueJob;
};

export type IMessageBody<T> = {
  messageId: string;
  message: T;
  date: string;
  messageAttribute: IMessageAttribute;
};

type IQueueAttributeValue = {
  DataType: MessageAttributeDataType;
} & MessageAttributeValue;

export type IQueueMessage = {
  queueUrl: string;
  body: string;
  messageDeduplicationId?: string;
  delaySeconds?: number;
  messageAttributes?: {
    jobType: {
      DataType: MessageAttributeDataType.STRING;
      StringValue: JobType;
    };
    messageId: {
      DataType: MessageAttributeDataType.STRING;
      StringValue: string;
    };
    [key: string]: IQueueAttributeValue;
  };
};
