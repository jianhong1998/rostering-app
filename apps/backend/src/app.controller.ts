import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async getHello(): Promise<void> {
    await this.appService.healthCheck();
  }

  @Get('/version')
  async checkVersion(): Promise<{ version: string }> {
    return await this.appService.getVersion();
  }
}
