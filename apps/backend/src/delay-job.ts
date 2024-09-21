import { NestFactory } from '@nestjs/core';
import { Handler } from 'aws-lambda';
import { DelayJobModule } from './delay-jobs/delay-job.module';
import serverlessExpress from '@codegenie/serverless-express';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(DelayJobModule);
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event, context, callback) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
