nestjs使用环境变量推荐@nestjs/config

@nestjs/config 内置dotenv，支持.env文件，支持环境变量覆盖

环境变量一般全局使用，所以在app.module.ts中引入

配置全局使用之后，就可以在其他模块中使用了
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

/\*
这里既然都是用装饰器函数，调用service的服务，那么getProfile，getUserById等函数名还有什么作用吗

1. 可读性与维护性
2. Swagger 文档自动生成时会用到函数名（如果启用）
3. 调试时日志栈清晰
4. IDE 提示、跳转、重构更安全
5. 代码组织更清晰
   \*/

配置全局导入

```js
...
import { ConfigModule } from '@nestjs/config'; // 配置模块
@Module({
  imports: [
    // 配置模块，forRoot是去读取.env文件
    ConfigModule.forRoot({
      isGlobal: true, // 是否全局 这样就不需要在其他的module中导入了
      ....
    }),
...
  ],
...
})
export class AppModule {}
```

```js
...
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    const db = this.configService.get('DB_NAME');
    console.log(db);
    return this.userService.findOne(id);
  }
}
```

```js
// 最佳使用实践
// src/common/constants/config-keys.enum.ts
export enum ConfigKeys {
  JWT_SECRET = 'JWT_SECRET',
  JWT_EXPIRES_IN = 'JWT_EXPIRES_IN',
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_NAME = 'DB_NAME',
  NODE_ENV = 'NODE_ENV',
}

// src/modules/user/user.controller.ts
import { ConfigKeys } from 'src/common/constants/config-keys.enum';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    const db = this.configService.get(ConfigKeys.DB_NAME);
    console.log(db);
    return this.userService.findOne(id);
  }
}

```
