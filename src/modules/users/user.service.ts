import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  getUserById(id: number) {
    return `User with id ${id}`;
  }

  create(data: any) {
    return `User created with data ${JSON.stringify(data)}`;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }
}
