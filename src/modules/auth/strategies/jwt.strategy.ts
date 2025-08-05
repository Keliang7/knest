import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从 Bearer Token 中提取
      ignoreExpiration: false,
      secretOrKey: 'demo-secret', // 👈 最简单的写死 secret（生产建议放到 .env）
    });
  }

  async validate(payload: any) {
    // payload 是你签发 token 时 encode 的内容
    return { userId: payload.sub, username: payload.username };
  }
}
