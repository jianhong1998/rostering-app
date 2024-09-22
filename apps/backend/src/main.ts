import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverlessExpress from '@codegenie/serverless-express';
import { Handler } from 'aws-lambda';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser(configService.get('COOKIE_SECRET') ?? 'secret'));
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();

  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event, context, callback) => {
  server = server ?? (await bootstrap());

  Logger.log(JSON.stringify({ event }), 'EventValue');

  return server(event, context, callback);
};
