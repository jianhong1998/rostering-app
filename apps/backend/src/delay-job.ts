import { Handler, SQSEvent, SQSRecord } from 'aws-lambda';
import { EventHelperUtil } from './delay-jobs/utils/event-helper.util';
import { EVENT_MAP } from './delay-jobs/constants';
import { IEventInfo } from './delay-jobs/types/event.type';
import { DelayJobLogger } from './delay-jobs/utils/delay-job-logger.util';

export const handler: Handler = async (
  event: SQSEvent,
  _context,
  _callback,
) => {
  const logger = new DelayJobLogger('Root');

  if (!('Records' in event)) {
    logger.log('Cannot identify event as a SQS event');
    return;
  }

  const pendingList = event.Records;
  const failedList = [] as SQSRecord[];

  for (const record of pendingList) {
    try {
      const { jobType } = await EventHelperUtil.extractEventAttributes(record);
      const handler = EVENT_MAP.get(jobType);

      await handler(record as unknown as IEventInfo);
    } catch (error) {
      console.error(error);
      failedList.push(record);
    }
  }

  logger.log({ failedList });
};
