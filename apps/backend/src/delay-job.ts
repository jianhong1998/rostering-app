import { Handler, SQSEvent, SQSRecord } from 'aws-lambda';
import { EventHelperUtil } from './delay-jobs/utils/event-helper.util';
import { EVENT_MAP } from './delay-jobs/constants';
import { IEventInfo } from './delay-jobs/types/event.type';

export const handler: Handler = async (
  event: SQSEvent,
  _context,
  _callback,
) => {
  if (!('Records' in event)) {
    console.log('Cannot identify event as a SQS event');
    return;
  }

  const pendingList = event.Records;
  const failedList = [] as SQSRecord[];

  for (const record of pendingList) {
    // console.log(JSON.stringify(record));

    try {
      const { jobType } = await EventHelperUtil.extractEventAttributes(record);
      const handler = EVENT_MAP.get(jobType);

      await handler(record as unknown as IEventInfo);
    } catch (error) {
      console.error(error);
      failedList.push(record);
    }
  }

  console.log({ failedList });
};
