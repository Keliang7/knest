// 对应 数据库表
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum IDType {
  ID_CARD = 'ID_CARD',
  PASSPORT = 'PASSPORT',
}
@Entity('user') // 指定数据库表名 不指定则默认使用类名作为表名
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column()
  nickname: string;

  @Column({ select: false })
  password: string;

  @Column()
  email: string;

  @Column()
  telephone: string;

  @Column({ type: 'enum', enum: IDType })
  id_type: IDType;

  @Column()
  id_number: string;

  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  @Column()
  avatar: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column()
  signature: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;
}
