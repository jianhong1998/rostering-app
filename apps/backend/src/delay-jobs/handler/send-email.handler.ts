import { featureFlags } from '../constants';
import { EmailService } from '../services/email.service';
import { PostmarkEmailService } from '../services/postmark-email.service';
import { EventHandler } from '../types/event-handler.type';

export const sendEmailEventHandler: EventHandler = async (event) => {
  if (featureFlags.enablePostmarkEmailService) {
    await PostmarkEmailService.handleSendEmail(event);
    return;
  }

  await EmailService.handleSendEmail(event);
};
