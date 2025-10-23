// JWT /Local 等策略

## Strategy 的理解

**Strategy（策略）** 是一种可插拔的规则或算法方案，它定义“怎么做”，而不是“做什么”。  
在 NestJS 中，Strategy 通常用于认证、缓存、支付、表单处理等场景，代表一类可替换的处理方式。

### 与 Service 的区别
- **Service**：执行具体业务逻辑，控制流程；
- **Strategy**：封装可替换的实现方案或规则；
- Service 可以选择并调用不同的 Strategy；
- 两者都是 Provider，只是职责不同。

### 常见用途
- AuthModule 中的 JwtStrategy、LocalStrategy：用于定义认证规则；
- CacheModule 中的 MemoryStrategy、RedisStrategy：用于定义缓存策略；
- PaymentModule 中的 WechatPayStrategy、AliPayStrategy：用于定义支付策略。


### 总结
Strategy 是 Service 的扩展点，它让系统逻辑更灵活、更易扩展。  
当需要支持多种可替换方案时，用 Strategy 可以避免 Service 过度臃肿，符合“开闭原则”（对扩展开放，对修改关闭）。

### 触发方式
在某些场景下，Strategy 不是由 Service 主动调用，而是由 **Guard（守卫）** 触发。  
例如：
- 在认证系统中，`JwtStrategy` 和 `LocalStrategy` 通常由 `AuthGuard` 自动调用；
- Guard 会在请求进入控制器前执行，触发对应的 Strategy 完成验证逻辑。

因此，Strategy 既可以作为 Service 的可插拔扩展点，也可以作为 Guard 的执行规则存在。  
它的本质是一个由框架自动调度或 Service 调用的、可被依赖注入的逻辑模块。
