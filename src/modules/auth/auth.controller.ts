// src/modules/auth/auth.controller.ts
import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  // 极简登录：实际项目里应该校验账号、密码，随后签发
  @Post('login')
  login() {
    const payload = { username: 'test-user', sub: 1 };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // 受保护接口：演示 guard → strategy → controller 链路
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req: any) {
    // req.user 来自 JwtStrategy.validate()
    return { user: req.user };
  }
}
