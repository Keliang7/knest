# 环境变量管理

在项目中，推荐使用 `.env` 文件来管理环境变量。通常会有多个环境文件，例如：

- `.env`
- `.env.development`
- `.env.production`

为了确保环境变量的正确性，可以使用 `Joi` 进行校验。

# 脚本配置

安装 `cross-env` 以便在不同操作系统上统一设置环境变量：

```bash
pnpm add -D cross-env
```

在 `package.json` 中配置启动脚本：

```json
"scripts": {
  "start:dev": "cross-env NODE_ENV=development nest start --watch",
  "start:prod": "cross-env NODE_ENV=production node dist/main.js"
}
```

# ConfigKeys 枚举

推荐配合 TypeScript 的 `enum` 使用，统一管理配置键：

```ts
export enum ConfigKeys {
  JWT_SECRET = 'JWT_SECRET',
  JWT_EXPIRES_IN = 'JWT_EXPIRES_IN',
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_NAME = 'DB_NAME',
  NODE_ENV = 'NODE_ENV',
}
```

# Joi 校验

在 `ConfigModule.forRoot()` 中，可以通过 `validationSchema` 属性使用 `Joi` 来校验环境变量。官方推荐使用 `Joi` 来确保环境变量的有效性和正确性。

示例代码：

```ts
import * as Joi from 'joi';

ConfigModule.forRoot({
  // 其他配置项
  validationSchema: Joi.object({
    // jwt
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES_IN: Joi.string().default('1d'),

    // 数据库
    DB_HOST: Joi.string().required().ip(),
    DB_PORT: Joi.number().default(3306),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().allow(''),
    DB_NAME: Joi.string().required(),

    NODE_ENV: Joi.string()
      .valid('development', 'test', 'production')
      .default('development'),
  }),
});
```

`Joi.string()` 用于验证变量是否为字符串类型。更多详细用法参考官方文档：[https://joi.dev/api/?v=17.13.3#string](https://joi.dev/api/?v=17.13.3#string)

## 关于 Joi 和前端表单验证

`Joi` 的设计思想和前端表单验证类似，都是对输入数据进行规则校验，确保数据的合法性和完整性。但 `Joi` 主要用于后端环境变量和接口数据的验证，通常不会直接用于前端表单验证。前端表单验证更多依赖于浏览器内置验证、第三方库（如 `Formik`、`Yup`）等。

# 最佳实践建议

- 建议在项目中维护一个 `.env.example` 文件，列出所有需要的环境变量及说明，方便团队成员了解和配置。
- 不同环境使用不同的 `.env` 文件，如 `.env.development`，`.env.production`，并通过脚本自动加载对应文件。
- 生产环境的敏感信息（如数据库密码、JWT 密钥）应通过安全的 secrets 管理工具（如 Vault、AWS Secrets Manager）进行管理，避免直接写入代码库或环境文件。
- 使用 `Joi` 校验环境变量，能够及早发现配置错误，提升系统稳定性。
