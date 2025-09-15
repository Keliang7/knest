// src/database/seeds/user.seed.ts
import { DataSource } from 'typeorm';
import { User } from 'src/modules/users/user.entity';

export async function seedUsers(dataSource: DataSource) {
  const repo = dataSource.getRepository(User);

  // 检查是否已经有 admin 用户
  const exists = await repo.findOne({ where: { username: 'admin' } });
  if (exists) return;

  const admin = repo.create({
    username: 'admin',
    password: '123456', // 实际中要做 hash
  });

  await repo.save(admin);
}
