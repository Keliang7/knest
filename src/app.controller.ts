import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { TestService } from './test.service';
import { HttpExceptionFilter } from './exception/http-exception.filter';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly testService: TestService,
  ) {}

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
  addData(
    @Body() body: Record<string, any>,
    @Query() query: Record<string, string>,
  ): string {
    console.log(body, query);
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

  @Get('test/:id')
  @UseFilters(HttpExceptionFilter)
  getTest(@Param() param): string {
    return this.testService.getTest(param);
  }
}
