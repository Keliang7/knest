import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import jwtConfig from './config/jwt.config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // 这里放到全局模块中，这样就可以在整个应用中使用了
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'keliang7.cn',
      port: 3306,
      username: 'root',
      password: 'LAq1234567',
      database: 'knest',
      autoLoadEntities: true, // 自动加载实体    entities: [__dirname + '/**/*.entity{.ts,.js}'], // 实体文件的路径
      synchronize: true, // 生产环境设为 false！
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [jwtConfig],
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRES_IN: Joi.string().default('1d'),
      }),
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
