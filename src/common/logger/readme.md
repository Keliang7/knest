当前目录说明：
src/common/logger/
├─ winston.config.ts // （必备）winston 实例/transport 配置
├─ logger.module.ts // （必备）导入 WinstonModule.forRoot(...)，@Global()
├─ logger.service.ts // （必备或可选）对外统一封装、实现 ILogger 接口
├─ logger.constants.ts // （可选）日志相关常量（label、默认级别等）
├─ logger.interceptor.ts // （可选）记录每次请求的入参/耗时/结果（AOP）
├─ logger.middleware.ts // （可选）低阶 HTTP 访问日志（类似 morgan）
└─ readme.winston.md // 使用说明（已经有）

part2 Nest内置与自定义日志

## 内置日志系统

NestJS 提供了内置日志系统，可以通过 `NestFactory.create()` 的第二个参数控制是否启用内置日志。

示例：

```js
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### `logger` 参数说明

| 类型            | 说明                                       |
| --------------- | ------------------------------------------ |
| `LoggerService` | 自定义日志服务实例                         |
| `LogLevel[]`    | 指定启用的日志级别，如 `['error', 'warn']` |
| `false`         | 禁用内置日志                               |

### 日志级别

| 级别    | 说明                     |
| ------- | ------------------------ |
| log     | 通用日志                 |
| error   | 错误日志                 |
| warn    | 警告日志                 |
| debug   | 调试日志                 |
| verbose | 详细日志（非必要不打印） |

---

## 自定义日志

可以通过传入自定义日志级别数组或实现 `LoggerService` 来定制日志行为。

示例：

```js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
  logger.warn(`Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
```

---

## 在 Controller 中使用日志

在 Controller 内部可以局部初始化 `Logger`，便于输出相关日志信息。

示例：

```js
@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name); // 局部初始化一个 logger

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
}
```
