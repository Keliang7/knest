import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'keliang7.cn',
      port: 3306,
      username: 'root',
      password: 'LAq1234567',
      database: 'knest',
      autoLoadEntities: true,
      synchronize: true, // 生产环境设为 false！
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
