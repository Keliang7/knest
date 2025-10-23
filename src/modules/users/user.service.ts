import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findOne(id: number): Promise<User> {
    return this.userRepo.findOne({ where: { id } });
  }

  async findByUsername(username: string) {
    return this.userRepo.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
      // 👈 必须显式选出 password
    });
  }

  // 查找包括已软删除的用户（withDeleted: true 会包含被软删除的数据）
  async findOneWithDeleted(id: number): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
      withDeleted: true, // 包含被软删除的数据进行查找
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepo.findOne({
      where: { username: data.username },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepo.create({
      ...data,
      password: hashedPassword,
    }); // 创建一个新的用户实体实例 但不保存到数据库中
    const savedUser = await this.userRepo.save(user); // 保存用户实体到数据库中
    // 不返回密码字段
    const { password: _removed, ...result } = savedUser;
    return result as User;
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    this.userRepo.merge(user, data);
    const updatedUser = await this.userRepo.save(user);
    const { password: _removed, ...result } = updatedUser;
    return result as User;
  }

  // 软删除用户（保留数据库记录，将 deleted_at 字段设置为当前时间）
  // 使用 TypeORM 的 softDelete 方法实现软删除
  async softRemove(id: number): Promise<void> {
    await this.userRepo.softDelete(id); // 使用 TypeORM 的 softDelete 方法实现软删除
  }

  // 恢复已软删除的用户（将 deleted_at 字段设置为 null）
  // 使用 TypeORM 的 restore 方法恢复软删除记录
  async restore(id: number): Promise<void> {
    await this.userRepo.restore(id); // 使用 TypeORM 的 restore 方法恢复软删除记录
  }

  async hardRemove(id: number): Promise<void> {
    await this.userRepo.delete(id); // 删除数据库中的记录
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  // 分页查询用户数据，按 id 倒序排列
  // 使用 TypeORM 的 findAndCount 方法实现分页
  async paginate(
    page: number,
    limit: number,
  ): Promise<{ data: User[]; total: number }> {
    const [data, total] = await this.userRepo.findAndCount({
      skip: (page - 1) * limit, // 跳过前面页的数据
      take: limit, // 限制返回的数据条数
      order: { id: 'DESC' }, // 根据 id 倒序排序
    });
    return { data, total }; // 返回分页数据和总数
  }
}
