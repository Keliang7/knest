import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from 'src/common/constants/config-keys.enum';
import { LoggerService } from '@/common/logger/logger.service';

/* 
  这里既然都是用装饰器函数，调用service的服务，那么getProfile，getUserById等函数名还有什么作用吗

  1. 可读性与维护性
  2. Swagger 文档自动生成时会用到函数名（如果启用）
  3. 调试时日志栈清晰
  4. IDE 提示、跳转、重构更安全
  5. 代码组织更清晰
*/

@Controller('user')
export class UserController {
  // private logger = new Logger(UserController.name); // 局部初始化一个logger
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    // this.logger.warn('UserController initialized');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    this.logger.warn(`Fetching user with id: ${id}`);
    const db = this.configService.get(ConfigKeys.DB_PORT);
    console.log(db);
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    return this.userService.update(id, updateUserDto);
  }
}

/* 
  import { Controller, Get } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';

@Controller('user')
export class UserController {
  constructor(private readonly logger: LoggerService) {}

  @Get()
  findAll() {
    this.logger.log('Fetching all users', 'UserController');
    this.logger.warn('This is a warning');
    this.logger.error('Something went wrong', 'stacktrace...', 'UserController');

    return { message: 'OK' };
  }
}

*/
