import { JobType } from 'src/queue-producer/enums/job-type.enum';

import { sendEmailEventHandler } from '../handler/send-email.handler';
import { EventHandler } from '../types/event-handler.type';

export const EVENT_MAP = new Map<string, EventHandler>([
  [JobType.SEND_EMAIL, sendEmailEventHandler],
]);
