import Mail from 'nodemailer/lib/mailer';
import { MessageAttributeDataType } from 'src/queue-producer/enums/message-attribute-data-type.enum';

export interface IEventInfo {
  messageId: string;
  receiptHandle: string;
  body: string;
  attributes: {
    SenderId: string;
    ApproximateFirstReceiveTimestamp: string;
    ApproximateReceiveCount: string;
    SentTimestamp: string;
  };
  messageAttributes: {
    jobType: {
      stringValue: string;
      stringListValues: string[];
      binaryListValues: Buffer[];
      dataType: MessageAttributeDataType;
    };
    messageId: {
      stringValue: string;
      stringListValues: string[];
      binaryListValues: Buffer[];
      dataType: MessageAttributeDataType;
    };
  };
  md5OfBody: string;
  eventSource: 'aws:sqs';
  eventSourceARN: string;
}

export interface IEventBody {
  date: string;
  messageId: string;
  message: Mail.Options;
  messageAttribute: IEventInfo['messageAttributes'];
}
