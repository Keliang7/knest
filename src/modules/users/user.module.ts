import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [
    // 数据库和本地entity的映射关系  数据库的表名和本地的entity的类名一致
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  // providers: [UserService] 是告诉 NestJS：“我要用这个服务，帮我管理它的生命周期，并支持注入。”
})
export class UserModule {}
