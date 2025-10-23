// src/modules/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

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
