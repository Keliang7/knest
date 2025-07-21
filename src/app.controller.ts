import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('data/:id')
  getData(@Param() params): string {
    console.log(params.id);
    return 'data';
  }

  @Get('data')
  getAllData(): string {
    return 'all data';
  }

  @Post('data')
  addData(): string {
    return 'add data';
  }

  @Put('data')
  updateDate(): string {
    return 'update data';
  }

  @Delete('data')
  deleteData(): string {
    return 'delete data';
  }
}
