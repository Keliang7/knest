// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // login
  async login({ username, password }: { username: string; password: string }) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('密码错误');
    }
    const payload = { sub: user.id, username: user.username };
    return {
      username: user.username,
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * 签发 access token
   */
  signAccessToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload);
  }

  /**
   * 验证 token（可用于手动校验）
   */
  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }

  /**
   * 解析 token（不校验签名，调试用）
   */
  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
