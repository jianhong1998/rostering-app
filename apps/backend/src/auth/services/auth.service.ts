import { Injectable } from '@nestjs/common';
import { LoginEmailGenerator } from 'src/emails/generator';
import { EmailQueueProducerService } from 'src/queue-producer/services/email-producer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly QueueProducerService: EmailQueueProducerService,
  ) {}

  public async login() {
    const emailAddress = 'jianhong@mavericks-consulting.com';
    // const emailMessage = 'Some message';
    // const queueMesage = {
    //   emailAddress,
    //   emailMessage,
    // };

    const message = new LoginEmailGenerator().generateEmailOptions({
      addresses: {
        to: emailAddress,
        from: emailAddress,
        replyTo: 'jiyue0904@gmail.com',
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
