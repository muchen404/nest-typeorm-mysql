import { ErrorCodeEnum } from '@/enum/error-code.enum';
import { BusinessException } from '@/filters/business.exception.filter';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigEnum } from '../enum/config.enum';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1'
})
export class UserController {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {
    this.logger.warn('UserController Init', 'UserController');
  }

  @Get('test')
  test() {
    console.log('test api', this.configService.get(ConfigEnum.DB_TYPE));
    console.log('test api', this.configService.get(ConfigEnum.DB_HOST));
    console.log('test api', this.configService.get(ConfigEnum.DB_PASSWORD));

    return 'Hello World!';
  }

  @Get()
  getUsers() {
    return this.userService.find();
  }

  @Get('/profile/:id')
  getUserProfile(@Param() param) {
    return this.userService.getUserProfile(param.id);
  }

  @Get('/logs/:id')
  getUserLogs(@Param() param) {
    return this.userService.findUserLogs(param.id);
  }

  @Get(':id')
  getUserById(@Param() param) {
    console.log(param);
    return this.userService.findOne(param.id);
  }

  @Post()
  async createUser(@Body() user: User) {
    // 查询用户ID是否存在
    const findUser = await this.userService.findUserByUsername(user.username);
    if (findUser?.id) {
      throw new BusinessException({
        code: ErrorCodeEnum.UERRNAME_ALREADY_EXIST,
        message: 'username already exist'
      });
    }

    return this.userService.create(user);
  }

  @Put()
  updateUser(@Body() user: User) {
    return this.userService.update(user.id, user);
  }

  @Delete()
  deleteUser(@Body() id) {
    return this.userService.delete(id);
  }

  @Get('/logsByGroup/:id')
  async getLogsByGroup(@Param() { id }) {
    const result = await this.userService.findLogsByGroup(id);
    if (result.code === 0) {
      return (result.data = result.data.map((o) => ({
        result: o.result,
        count: o.count
      })));
    }
  }
}
