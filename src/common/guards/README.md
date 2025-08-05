// 守卫
// src/modules/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

/src/modules/users/user.controller.ts
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
return req.user;
}

我现在只做了这两步，我只需要最简单的实现demo，看效果，
还差哪些

pnpm add @nestjs/passport passport passport-jwt @nestjs/jwt

pnpm add -D @types/passport-jwt

文件路径：src/modules/auth/strategies/jwt.strategy.ts

整理一下
首先
// src/modules/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

2./src/modules/auth/strategies/jwt.strategy.ts
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

3.src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
imports: [
PassportModule,
JwtModule.register({
secret: 'demo-secret', // 👈 一定要和 strategy 保持一致
signOptions: { expiresIn: '1d' },
}),
],
providers: [JwtStrategy],
exports: [JwtModule], // 方便其他模块使用 sign()
})
export class AuthModule {}

4./src/modules/users/user.module.tsimport { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';

@Module({
imports: [AuthModule],
controllers: [UserController],
providers: [UserService],
})
export class UserModule {}

5./src/modules/users/user.controller.ts
import {
Controller,
Get,
Param,
Body,
Post,
UseGuards,
Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'; // ✅ 你漏掉了这个

@Controller('users')
export class UserController {
constructor(private readonly userService: UserService) {}

@Get(':id')
getUserById(@Param('id', ParseIntPipe) id: number) {
return this.userService.getUserById(id);
}

@Post()
create(@Body() dto: CreateUserDto) {
return this.userService.create(dto);
}

@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
return req.user;
}
}
