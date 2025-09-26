这里主要讲ConfigModule.forRoot() 的validationSchema属性 & Joi的使用

 todo keliang7 joi是否类似前端表单验证，或者说前端表单验证是否使用joi

```js
import * as Joi from 'joi'; 
ConfigModule.forRoot({
  ...
    /**
     * Environment variables validation schema (Joi).
     * 官方是推荐使用Joi来校验环境变量
     */
    validationSchema: Joi.object({
    // jwt
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES_IN: Joi.string().default('1d'),
    // db
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(3306),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().allow(''),
    DB_NAME: Joi.string().required(),
    NODE_ENV: Joi.string()
      .valid('development', 'test', 'production')
      .default('development'),
  }),
}),
```
