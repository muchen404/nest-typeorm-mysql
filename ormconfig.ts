import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ConfigEnum } from 'src/enum/config.enum';
import { DataSource, DataSourceOptions } from 'typeorm';

function getEnv(env: string): Record<string, unknown> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
}

const entitiesDir =
  process.env.NODE_ENV === 'production'
    ? ['src/**/*.entity{.js,.ts}']
    : ['src/**/*.entity.ts'];

function buildConnectionOptions() {
  const detaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'development'}`);
  const config = { ...detaultConfig, ...envConfig };

  return {
    type: config[ConfigEnum.DB_TYPE],
    port: config[ConfigEnum.DB_PORT],
    host: config[ConfigEnum.DB_HOST],
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSWORD],
    database: config[ConfigEnum.DB_DATABASE],
    synchronize: config[ConfigEnum.DB_SYNC],
    entities: entitiesDir,
    logging: process.env.NODE_ENV === 'development'
  } as TypeOrmModuleOptions;
}

export const connectionParams = buildConnectionOptions();

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migrations/**'],
  subscribers: []
} as DataSourceOptions);