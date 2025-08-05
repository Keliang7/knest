import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    console.log(id, typeof id);
    return this.userService.getUserById(id);
  }
}
