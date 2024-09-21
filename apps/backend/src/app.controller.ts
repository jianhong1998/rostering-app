import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators';
import { EnvironmentVariableUtil } from './common/utils/environment-variable.util';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly envVarUtil: EnvironmentVariableUtil,
  ) {}

  @Get('/')
  @Public()
  async getHello(): Promise<void> {
    await this.appService.healthCheck();
  }

  @Get('/version')
  @Public()
  async checkVersion(): Promise<{ version: string }> {
    /**@todo remove*/
    Logger.log({
      envVar: this.envVarUtil.getVariables(),
    });
    return await this.appService.getVersion();
  }
}
