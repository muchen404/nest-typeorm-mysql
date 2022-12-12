import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorCodeEnum } from '@/enum/error-code.enum';

export interface Response<T> {
  data: T;
}

export class TransformIntorceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        code: ErrorCodeEnum.ERR_OK,
        extra: {},
        message: 'success',
        success: true
      }))
    );
  }
}
