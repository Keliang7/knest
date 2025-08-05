import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUserById(id: number) {
    return `User with id ${id}`;
  }

  create(data: any) {
    return `User created with data ${JSON.stringify(data)}`;
  }
}
