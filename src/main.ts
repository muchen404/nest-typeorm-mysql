import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = 5789;

  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();
