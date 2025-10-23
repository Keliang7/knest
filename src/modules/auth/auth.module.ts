// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    // ✅ 指定默认策略 + 无状态
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    // ✅ 只需注册一次 ConfigModule
    ConfigModule.forFeature(jwtConfig),
    // ✅ 异步注册 JwtModule
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: { expiresIn: config.get<string>('jwt.expiresIn') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService], // 本模块可以使用
  exports: [AuthService], // ✅ 仅导出服务（不暴露 JwtModule）
})
export class AuthModule {}
