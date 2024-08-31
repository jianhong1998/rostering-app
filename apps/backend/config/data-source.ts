import { readFileSync } from 'fs';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const rscaPath = join(__dirname, '../../ap-southeast-1-bundle.pem');
const pemCa = readFileSync(rscaPath);

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: +(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DATABASE_DB || 'mqb',
  synchronize: process.env.NODE_ENV !== 'dev',
  entities: ['dist/**/*.model{.js,.ts}'],
  migrations: ['dist/src/database/migrations/**/*{.js,.ts}'],
  seeds: ['dist/src/database/seeders/**/*{.js,.ts}'],
  factories: ['dist/src/database/factories/**/*{.js,.ts}'],
  seedTracking: false,
  ssl:
    process.env.NODE_ENV === 'dev'
      ? undefined
      : {
          rejectUnauthorized: true,
          ca: [pemCa],
        },
};

export const dataSource = new DataSource(options);
