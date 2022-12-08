import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const PORT = 5789;

  const app = await NestFactory.create(AppModule, {});
  const httpAdapter = app.get(HttpAdapterHost);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalFilters(new AllExceptionFilter(Logger, httpAdapter));

  await app.listen(PORT);
}
bootstrap();
