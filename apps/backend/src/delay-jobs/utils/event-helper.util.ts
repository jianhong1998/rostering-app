import { SQSRecord } from 'aws-lambda';
import { JobType } from 'src/queue-producer/enums/job-type.enum';

import { IEventAttributes } from '../types/event-attributes.type';

export class EventHelperUtil {
  private validJobTypeValueSet: Set<string>;

  private static instance: EventHelperUtil;

  private constructor() {
    this.validJobTypeValueSet = new Set<string>(Object.values(JobType));
  }

  public static async extractEventAttributes(
    record: SQSRecord,
  ): Promise<IEventAttributes> {
    const { messageAttributes } = record;

    if (
      !('jobType' in messageAttributes) ||
      !messageAttributes.jobType.stringValue
    )
      throw new Error('"job" value is not in SQS record');

    if (
      !('messageId' in messageAttributes) ||
      !messageAttributes.messageId.stringValue
    )
      throw new Error('"messageId" value is not in SQS record');

    const jobTypeValue = messageAttributes.jobType.stringValue;
    const messageIdValue = messageAttributes.messageId.stringValue;

    if (!this.verifyJobTypeValue(jobTypeValue))
      throw new Error(`Invalid job type value: ${jobTypeValue}`);

    return {
      jobType: jobTypeValue,
      messageId: messageIdValue,
    };
  }

  private static verifyJobTypeValue(jobType: string): boolean {
    const instance = this.getInstance();
    return instance.validJobTypeValueSet.has(jobType);
  }

  private static getInstance(): EventHelperUtil {
    if (this.instance) return this.instance;

    this.instance = new EventHelperUtil();
    return this.instance;
  }
}
