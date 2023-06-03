import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '@/users/constants';

@Entity({ name: 'users' })
export default class UsersOrm extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    unique: true,
  })
  email: string | null;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  phone: string | null;

  @Column({ type: 'varchar', length: 80 })
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  name: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: '0.00',
  })
  balance: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Client })
  role: UserRole;
}
