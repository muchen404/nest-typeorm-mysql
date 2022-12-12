// 业务响应拦截器
import { ErrorCodeEnum } from '@/enum/error-code.enum';
import { HttpException, HttpStatus, NestInterceptor } from '@nestjs/common';

type BusinessError = {
  code: ErrorCodeEnum;
  message: string;
};

export class BusinessException extends HttpException {
  constructor(err: BusinessError | string) {
    if (typeof err === 'string') {
      err = {
        code: ErrorCodeEnum.ERR_NORMAL,
        message: err
      };
    }
    super(err, HttpStatus.OK);
  }

  static throwForbidden() {
    throw new BusinessException({
      code: ErrorCodeEnum.ACCESS_FORBIDDEN,
      message: '抱歉哦，您无此权限！'
    });
  }
}
