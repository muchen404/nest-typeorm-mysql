import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { connectionParams } from 'ormconfig';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_TYPE: Joi.string()
      })
    }),
    TypeOrmModule.forRoot(connectionParams),
    UserModule
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger]
})
export class AppModule {}
