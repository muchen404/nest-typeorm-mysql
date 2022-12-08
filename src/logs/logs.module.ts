import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { utilities, WinstonModule, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import { Console } from 'winston/lib/winston/transports';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { ConfigEnum } from 'src/enum/config.enum';

function createDailyRotateTrasnport(level: string, filename: string) {
  return new DailyRotateFile({
    level,
    dirname: 'logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple()
    )
  });
}

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const consoleTransPorts = new Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike()
          )
        });

        return {
          transports: [
            consoleTransPorts,
            ...(configService.get(ConfigEnum.LOG_ON)
              ? [
                  createDailyRotateTrasnport('info', 'application'),
                  createDailyRotateTrasnport('warn', 'error')
                ]
              : [])
          ]
        } as WinstonModuleOptions;
      }
    })
  ]
})
export class LogsModule {}
