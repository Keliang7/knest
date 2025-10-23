// src/modules/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('jwt.secret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // ✅ 返回值将自动附加到 req.user
    return { userId: payload.sub, username: payload.username };
  }
}
/* 
  ✅ 可选优化：
	•	若你将来需要根据 token 中的 userId 查询数据库，可在这里做：

  const user = await this.userService.findById(payload.sub);
if (!user) throw new UnauthorizedException();
return user;
*/

// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(config: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: config.get<string>('jwt.secret'),
//       ignoreExpiration: false,
//     });
//   }

//   async validate(payload: any) {
//     // 这里可查库补充权限/状态等。返回值会挂到 req.user
//     return { userId: payload.sub, username: payload.username };
//   }
// }
