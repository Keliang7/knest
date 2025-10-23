// guards 翻译 守卫

通常是配合strategy使用的

```ts
// src/modules/auth/auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
    ...
  @Post('login')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req: any) {
    return { user: req.user };
  }
}
```

## Guard 的理解

**Guard（守卫）** 是 NestJS 中用于在请求到达控制器之前进行拦截和验证的机制。  
它的主要职责是决定“请求是否可以继续往下执行”。

### 主要作用

- 控制访问权限：例如，验证用户是否已登录；
- 结合 Strategy 使用：如 `JwtAuthGuard` 会触发对应的 `JwtStrategy` 来验证 Token；
- 可实现角色权限控制、白名单校验、接口防刷等逻辑。

### 与 Strategy 的关系

- Guard 是“触发者”，负责在请求前调用对应的 Strategy；
- Strategy 是“执行者”，定义具体的验证规则；
- 两者常常一起使用：Guard 控制流程，Strategy 执行验证。

### 执行流程

1. 请求进入 Nest 应用；
2. 全局或局部的 Guard 被触发；
3. Guard 调用相应的 Strategy（如 JWT 验证策略）；
4. 若通过验证，请求继续到 Controller；
5. 若验证失败，请求被拒绝。

### 总结

Guard 是请求进入控制器前的“第一道防线”，  
用于决定某个请求是否有资格继续执行。  
它通常与 Strategy 搭配，用于实现灵活、安全的认证和授权体系。
