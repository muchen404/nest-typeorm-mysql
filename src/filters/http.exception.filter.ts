import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  LoggerService
} from '@nestjs/common';
import { BusinessException } from './business.exception.filter';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    this.logger.error(exception.message, exception.stack);
    if (exception instanceof BusinessException) {
      const error = exception.getResponse();
      response.status(status).json({
        data: null,
        code: error['code'],
        extra: {},
        message: error['message'],
        success: false
      });
      return;
    }

    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.getResponse()
    });
  }
}
