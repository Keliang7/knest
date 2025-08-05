// src/modules/auth/auth.controller.ts
import { Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Post('login')
  login() {
    const payload = { username: 'test-user', sub: 1 };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
