import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  findOne(id: number): Promise<User> {
    return this.userRepo.findOne({ where: { id } });
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(data); // 创建实体实例（不插入数据库）
    return this.userRepo.save(user); // 插入到数据库
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }
}
