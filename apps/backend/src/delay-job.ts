import { Handler, SQSEvent } from 'aws-lambda';

export const handler: Handler = async (
  event: SQSEvent,
  _context,
  _callback,
) => {
  if ('Records' in event) {
    event.Records.forEach((record) => {
      console.log(JSON.stringify(record));
    });
    return;
  }

  console.log('Cannot identify event as a SQS event');
};
