import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { ConfigModule } from '@nestjs/config'; // 配置模块
import * as Joi from 'joi';
import jwtConfig from './config/jwt.config';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    // 配置模块，forRoot是去读取.env文件
    ConfigModule.forRoot({
      isGlobal: true, // 是否全局 这样就不需要在其他的module中导入了
      cache: true,
      load: [jwtConfig],
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
  providers: [AppService],
})
export class AppModule {}
