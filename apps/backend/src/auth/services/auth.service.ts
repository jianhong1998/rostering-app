import { Injectable } from '@nestjs/common';
import { EmailQueueProducerService } from 'src/queue-producer/services/email-producer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly QueueProducerService: EmailQueueProducerService,
  ) {}

  public async login() {
    const emailMessage = 'Some message';
    const emailAddress = 'jianhong@mavericks-consulting.com';
    const queueMesage = {
      emailAddress,
      emailMessage,
    };

    await this.QueueProducerService.sendMessageToQueue(queueMesage);
  }
}
