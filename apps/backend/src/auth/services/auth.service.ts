import { Injectable } from '@nestjs/common';
import { JobType } from 'src/delay-jobs/queue/enums/job-type.enum';
import { MessageGroupId } from 'src/delay-jobs/queue/enums/message-group-id.enum';
import { EmailQueueProducerService } from 'src/delay-jobs/queue/services/email-producer.service';

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

    await this.QueueProducerService.sendMessageToQueue(
      queueMesage,
      JobType.EMAIL,
      MessageGroupId.EMAIL,
    );
  }
}
