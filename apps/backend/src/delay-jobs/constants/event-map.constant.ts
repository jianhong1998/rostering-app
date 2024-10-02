import { JobType } from 'src/queue-producer/enums/job-type.enum';
import { EmailService } from '../services/email.service';
import { IEventInfo } from '../types/event.type';

export const EVENT_MAP = new Map<
  string,
  (eventRecord: IEventInfo) => Promise<void>
>([
  [
    JobType.SEND_EMAIL,
    async (event) => {
      await EmailService.handleSendEmail(event);
    },
  ],
]);
