import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestService } from './test.service';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, TestService],
})
export class AppModule {}
