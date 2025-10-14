pnpm i winston winston-daily-rotate-file nest-winston

nestjs的logger可以被重写，比如使用winston

所以我们使用的时候，需要导入nestjs的logger，然后重写logger，这样就可以使用winston了。

main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createLogger } from 'winston';
import * as winston from 'winston';
import { utilities, WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file';

async function bootstrap() {
  const instance = createLogger({
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(),
        ),
      }),
      new winston.transports.DailyRotateFile({
        dirname: 'logs',
        filename: 'logs/%DATE%.log',
        level: 'warn',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
    ],
  });
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

app.module.ts

```typescript
import { Global, Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { ConfigModule } from '@nestjs/config'; // 配置模块
import * as Joi from 'joi'; // 验证环境变量的模块 参考当前目录下readme.md
import jwtConfig from './config/jwt.config';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Global()
@Module({
  imports: [
    // 配置模块，forRoot是去读取.env文件
    ConfigModule.forRoot({
      isGlobal: true, // 是否全局 这样就不需要在其他的module中导入了
      cache: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [jwtConfig], // 额外的加载配置文件
      // 说明：请看当前目录下readme.md
      validationSchema: Joi.object({
        // jwt
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRES_IN: Joi.string().default('1d'),
        // db
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(3306),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().allow(''),
        DB_NAME: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),
      }),
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
  // 告诉nestjs 把下面的Class类放到你的DI中进行初始化
  controllers: [AppController],
  // 告诉nestjs 下面的这个Class我需要注入到其他的地方去使用
  providers: [AppService, Logger],
  exports: [Logger], // 导出Logger
})
export class AppModule {}
```

user.controller.ts

```typescript
import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from 'src/common/constants/config-keys.enum';

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
  private logger = new Logger(UserController.name); // 局部初始化一个logger
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.logger.warn('UserController initialized');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    this.logger.warn(`Fetching user with id: ${id}`);
    // const db = this.configService.get(ConfigKeys.DB_PORT);
    // console.log(db);
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
```
