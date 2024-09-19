import { MessageAttributeValue } from '@aws-sdk/client-sqs';
import { MessageGroupId } from '../enums/message-group-id.enum';
import { MessageAttributeDataType } from '../enums/message-attribute-data-type.enum';

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

export type IQueueMessage = {
  id: string;
  queueUrl: string;
  body: string;
  messageGroupId?: MessageGroupId;
  messageDeduplicationId?: string;
  delaySeconds?: number;
  messageAttributes?: Record<
    string,
    MessageAttributeValue & { DataType: MessageAttributeDataType }
  >;
};
