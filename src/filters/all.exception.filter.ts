import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  LoggerService,
  InternalServerErrorException
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';
import { BusinessException } from './business.exception.filter';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // const responseBody = {
    //   resuestMessage: {
    //     headers: request.headers,
    //     query: request.query,
    //     body: request.body,
    //     params: request.params,
    //   },
    //   timestamp: new Date().toISOString(),
    //   ip: requestIp.getClientIp(request),
    //   exception: exception['name'],
    //   error: exception['response'] || 'Internal Server Error',
    //   data: null
    // };

    const responseBody = {
      code: httpStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: new InternalServerErrorException().getResponse()
    };

    this.logger.error('[-- Nest --]', responseBody);
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
