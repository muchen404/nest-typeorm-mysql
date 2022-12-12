import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/all.exception.filter';
import { Logger, VersioningType } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TransformIntorceptor } from '@/common/interceptors/transform.interceptors';
import { HttpExceptionFilter } from './filters/http.exception.filter';

async function bootstrap() {
  const PORT = 5789;

  const app = await NestFactory.create(AppModule, {});
  const httpAdapter = app.get(HttpAdapterHost);
  app.enableVersioning({
    type: VersioningType.URI
  });
  app.useGlobalInterceptors(new TransformIntorceptor());
  app.setGlobalPrefix('api');
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalFilters(
    new AllExceptionFilter(Logger, httpAdapter),
    new HttpExceptionFilter(Logger)
  );

  await app.listen(PORT);
}
bootstrap();
