// 管道
NestJS 的 Pipe 用于转换入参或验证参数，主要应用于：
	•	入参类型转换（如 string -> number）
	•	校验入参格式（如 DTO）
	•	自定义校验逻辑（如手机号是否合法）


!!!	import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 !! app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
记得加上这两行

功能
说明
✅ 校验请求参数
会读取 DTO 上的装饰器（比如 @IsString()、@IsEmail()）进行验证
✅ 自动抛出 400 错误
如果验证失败，会返回 statusCode: 400，并附带错误信息
✅ 保护接口安全
拒绝不符合规则的请求数据，避免垃圾数据入库
✅ 支持嵌套验证
嵌套对象字段也能验证
