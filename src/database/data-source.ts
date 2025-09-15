/* 
三、data-source.ts 什么时候被用到（典型场景）
	1.	生成迁移（将实体变更生成 SQL 迁移文件）
	2.	运行迁移（把迁移执行到数据库）
	3.	回滚迁移
	4.	执行独立的 seed 脚本（脚本直接 import dataSource 并 initialize()）
*/

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
