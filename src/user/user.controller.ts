import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';

@Controller('user')
export class UserController {
  constructor(private configService: ConfigService) {}

  @Get()
  test() {
    console.log('test api', this.configService.get(ConfigEnum.DB_TYPE));
    console.log('test api', this.configService.get(ConfigEnum.DB_HOST));
    console.log('test api', this.configService.get(ConfigEnum.DB_PASSWORD));

    return 'Hello World!';
  }
}
