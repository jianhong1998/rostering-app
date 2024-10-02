import { Injectable } from '@nestjs/common';
import { LoginEmailGenerator } from 'src/emails/generator';
import { EmailQueueProducerService } from 'src/queue-producer/services/email-producer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly QueueProducerService: EmailQueueProducerService,
  ) {}

  public async login() {
    const sender = 'jiyue0904@gmail.com';
    const recipient = 'jianhong@mavericks-consulting.com';
    const replyTo = 'jiyuesg@gmail.com';

    const message = new LoginEmailGenerator().generateEmailOptions({
      addresses: {
        to: recipient,
        from: sender,
        replyTo,
      },
      params: {
        expireDateTime: '2024-01-01 12:00PM',
        loginUrl: 'http://localhost:3001',
        name: 'Jian Hong',
      },
    });

    await this.QueueProducerService.sendMessageToQueue(message);
  }
}
