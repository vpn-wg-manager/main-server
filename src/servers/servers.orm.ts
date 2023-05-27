import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'servers' })
export default class ServersOrm extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  name: string;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    unique: true,
  })
  addr: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
  updatedDate: Date | null;
}
