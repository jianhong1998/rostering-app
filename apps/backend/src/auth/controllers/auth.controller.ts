import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { addMinutes } from 'date-fns';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { DateTimeHelper } from 'src/common/helpers/datetime.helper';
import { EnvironmentVariableUtil } from 'src/common/utils/environment-variable.util';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { LoginEmailGenerator } from 'src/emails/generator';
import { EmailQueueProducerService } from 'src/queue-producer/services/email-producer.service';
import { EntityManager } from 'typeorm';

import { LoginReqBody } from '../dto/req-body/login-req-body.dto';
import { AuthService } from '../services/auth.service';
import { TempTokenService } from '../services/temp-token.service';

@Controller('/auth')
export class AuthController {
  emailGenerator: LoginEmailGenerator;
  envVars: ReturnType<EnvironmentVariableUtil['getVariables']>;

  constructor(
    private readonly authService: AuthService,
    private readonly loggerUtil: LoggerUtil,
    private readonly emailQueueProducer: EmailQueueProducerService,
    private readonly tempTokenService: TempTokenService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    envVarUtil: EnvironmentVariableUtil,
  ) {
    this.emailGenerator = new LoginEmailGenerator();
    this.envVars = envVarUtil.getVariables();
  }

  @Post('/')
  @Public()
  async login(@Body() body: LoginReqBody) {
    const logger = this.loggerUtil.createLogger('LoginFunction');

    const { email } = body;
    const expireDate = addMinutes(new Date(), 5);
    const { emailSender, emailReplyTo, serverHost } = this.envVars;

    await this.entityManager.transaction(async (manager) => {
      const { user } = await this.authService.login(email);
      const token = await this.tempTokenService.generateTempToken({
        user,
        manager,
      });

      const expireDateTime = DateTimeHelper.format(
        expireDate,
        'dd MMM yyyy HH:mm',
      );

      const emailOptions = this.emailGenerator.generateEmailOptions({
        addresses: {
          from: emailSender,
          replyTo: emailReplyTo,
          to: email,
        },
        params: {
          expireDateTime: `${expireDateTime} (SGT)`,
          loginUrl: `${serverHost}/auth?id=${token}`,
          name: user.fullName,
        },
      });

      logger.log('Sending queue message to email queue...', 'LoginFunction');
      await this.emailQueueProducer.sendMessageToQueue(emailOptions);
      logger.log('Queue message is sent to email queue', 'LoginFunction');
    });

    return { isSuccess: true };
  }

  @Get('/')
  @Public()
  async getToken(@Query('id') tempTokenId: string, @Res() res: Response) {
    if (!tempTokenId)
      throw new BadRequestException(`Invalid id: ${tempTokenId}`);

    const { token, hashedSecret } =
      await this.authService.getActualToken(tempTokenId);

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .send({ hashedSecret });
  }
}
