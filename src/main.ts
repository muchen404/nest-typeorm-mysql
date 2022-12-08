import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as winston from 'winston';
import { utilities, WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const PORT = 5789;

  const instance = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike()
        )
      }),
      new winston.transports.DailyRotateFile({
        level: 'warn',
        dirname: 'logs',
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple()
        )
      }),
      new winston.transports.DailyRotateFile({
        level: 'info',
        dirname: 'logs',
        filename: 'info-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple()
        )
      })
    ]
  });

  const logger = WinstonModule.createLogger({
    instance
  });
  const app = await NestFactory.create(AppModule, {
    logger
  });
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(Logger, httpAdapter));

  await app.listen(PORT);
}
bootstrap();
