import { Handler, SQSEvent } from 'aws-lambda';

export const handler: Handler = async (event: SQSEvent, context, callback) => {
  console.log(JSON.stringify({ event, context, callback }));

  event.Records.forEach((record) => {
    console.log(JSON.stringify(record));
  });
};
