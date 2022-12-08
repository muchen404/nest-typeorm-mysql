import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  LoggerService,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private readonly logger: Logger
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
    this.logger.log('你好');
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
  createUser(@Body() user: User) {
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
