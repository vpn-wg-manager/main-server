import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import VpnOrm from '@/vpn/vpn.orm';
import { VpnStatus } from '@/vpn/constants';

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

  @Column({
    type: 'integer',
    default: 20,
  })
  maxUsers: number;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
  updatedDate: Date | null;

  @OneToMany((type) => VpnOrm, (vpn) => vpn.server)
  vpns: VpnOrm[];

  availableSlots: number;

  @AfterLoad()
  setComputed() {
    this.availableSlots =
      this.maxUsers -
      this.vpns?.filter((el) => el.status === VpnStatus.Approved).length;
  }
}
