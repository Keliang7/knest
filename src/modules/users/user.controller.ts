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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
