import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();
    const status = exception.getStatus();
    this.logger.error(exception.message, exception.stack);
    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      message: exception.message || exception.name
    });

    throw new Error('Method not implemented');
  }
}
