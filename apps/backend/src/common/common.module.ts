import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentVariableUtil } from './utils/environment-variable.util';

@Module({
  imports: [ConfigModule],
  providers: [EnvironmentVariableUtil],
  exports: [EnvironmentVariableUtil],
})
export class CommonModule {}
