import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfig } from './app.config';
import { UserModule } from './user/user.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [AppConfig.configModule, AppConfig.typeormModule, UserModule],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    const spyFn = {
      AppService: {
        healthCheck: jest.spyOn(AppService.prototype, 'healthCheck'),
      },
    };

    it('should return void', async () => {
      const result = await appController.getHello();

      spyFn.AppService.healthCheck.mockResolvedValueOnce(true);

      expect(result).toBeUndefined();
      expect(spyFn.AppService.healthCheck).toHaveBeenCalled();
    });
  });
});
