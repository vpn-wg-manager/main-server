import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VpnStatus } from '@/vpn/constants';
import UsersOrm from '@/users/users.orm';
import ServersOrm from '@/servers/servers.orm';

@Entity({ name: 'vpn' })
export default class VpnOrm extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => UsersOrm, (user) => user.vpns)
  user: UsersOrm;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  name: string;

  @ManyToOne((type) => ServersOrm, (server) => server.vpns)
  server: ServersOrm;

  @Column({ type: 'varchar', length: 40, nullable: false })
  forUserEmail: string;

  @Column({ type: 'enum', enum: VpnStatus, default: VpnStatus.WaitForApprove })
  status: VpnStatus;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
    default: null,
  })
  approvedDate: Date | null;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
    default: null,
  })
  waitForApproveFromDate: Date | null;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
    default: null,
  })
  disabledDate: Date | null;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdDate: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    nullable: true,
    default: null,
  })
  updatedDate: Date | null;
}
