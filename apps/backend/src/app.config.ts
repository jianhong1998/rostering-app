import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseConfig from './database/database.config';
import { DataSource } from 'typeorm';

export class AppConfig {
  private constructor() {}

  public static configModule = ConfigModule.forRoot({
    envFilePath: ['.env'],
    cache: false,
    isGlobal: true,
  });

  public static typeormModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      DatabaseConfig.getConfig(configService),
    dataSourceFactory: async (options) =>
      await new DataSource(options).initialize(),
  });
}
