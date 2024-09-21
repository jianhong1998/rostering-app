import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Public()
  async getHello(): Promise<void> {
    await this.appService.healthCheck();
  }

  @Get('/version')
  @Public()
  async checkVersion(): Promise<{ version: string }> {
    return await this.appService.getVersion();
  }
}
