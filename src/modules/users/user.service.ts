import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUserById(id: number) {
    return `User with id ${id}`;
  }
}
