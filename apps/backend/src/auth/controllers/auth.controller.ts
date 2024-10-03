import { Body, Controller, Post, Res } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginReqBody } from '../dto/req-body/login-req-body.dto';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { LoginEmailGenerator } from 'src/emails/generator';
import { addMinutes, format } from 'date-fns';
import { EmailQueueProducerService } from 'src/queue-producer/services/email-producer.service';
import { EnvironmentVariableUtil } from 'src/common/utils/environment-variable.util';

@Controller('/auth')
export class AuthController {
  emailGenerator: LoginEmailGenerator;
  envVars: ReturnType<EnvironmentVariableUtil['getVariables']>;

  constructor(
    private readonly authService: AuthService,
    private readonly loggerUtil: LoggerUtil,
    private readonly emailQueueProducer: EmailQueueProducerService,
    envVarUtil: EnvironmentVariableUtil,
  ) {
    this.emailGenerator = new LoginEmailGenerator();
    this.envVars = envVarUtil.getVariables();
  }

  @Post('/')
  @Public()
  async login(@Body() body: LoginReqBody, @Res() res: Response) {
    const logger = this.loggerUtil.createLogger('LoginFunction');

    const { email } = body;

    const { hashedSecret, token, user } = await this.authService.login(email);

    const expireDate = addMinutes(new Date(), 5);

    const emailOptions = this.emailGenerator.generateEmailOptions({
      addresses: {
        from: this.envVars.emailSender,
        replyTo: this.envVars.emailReplyTo,
        to: email,
      },
      params: {
        expireDateTime: format(expireDate, 'dd MMM yyyy HH:mm'),
        /**@todo change to actual backend endpoint*/
        loginUrl: 'http://localhost:3000',
        name: user.fullName,
      },
    });

    logger.log('Sending queue message to email queue...', 'LoginFunction');
    await this.emailQueueProducer.sendMessageToQueue(emailOptions);
    logger.log('Queue message is sent to email queue', 'LoginFunction');

    /**@todo move cookie sending to another endpoint that being sent via email*/
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.send({ hashedSecret });
  }
}
