import { Handler, SQSEvent, SQSRecord } from 'aws-lambda';

import { EVENT_MAP } from './delay-jobs/constants';
import { IEventInfo } from './delay-jobs/types/event.type';
import { DelayJobLogger } from './delay-jobs/utils/delay-job-logger.util';
import { EventHelperUtil } from './delay-jobs/utils/event-helper.util';

export const handler: Handler = async (
  event: SQSEvent,
  _context,
  _callback,
) => {
  const logger = new DelayJobLogger('Root');

  if (!('Records' in event)) {
    logger.error('Cannot identify event as a SQS event');
    throw new Error('Cannot identify event as a SQS event');
  }

  const pendingList = event.Records;
  const failedList = [] as SQSRecord[];

  for (const record of pendingList) {
    try {
      const { jobType } = await EventHelperUtil.extractEventAttributes(record);
      const handler = EVENT_MAP.get(jobType);

      await handler(record as unknown as IEventInfo);
    } catch (error) {
      logger.error(error);
      failedList.push(record);
    }
  }

  if (failedList.length) {
    logger.error({ failedList });
  } else {
    logger.log('All jobs are executed successfully');
  }
};
