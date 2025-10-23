// src/modules/auth/auth.controller.ts
import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login() {
    // 实际场景中应校验用户名密码
    const payload = { username: 'test-user', sub: 1 };
    return {
      access_token: this.authService.signAccessToken(payload),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req: any) {
    return { user: req.user };
  }
}
