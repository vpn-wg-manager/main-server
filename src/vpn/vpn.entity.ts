import BaseEntity, { NonFunctionProperties } from '@/types';
import { VpnStatus } from '@/vpn/constants';
import UsersEntity from '@/users/users.entity';
import ServersEntity from '@/servers/servers.entity';

export default class VpnEntity extends BaseEntity<VpnEntity> {
  readonly id: number;
  public user: Partial<NonFunctionProperties<UsersEntity>>;
  public name: string;
  public server: Partial<NonFunctionProperties<ServersEntity>>;
  public forUserEmail: string;
  public status: VpnStatus;
  public approvedDate: Date | null;
  public waitForApproveFromDate: Date | null;
  public disabledDate: Date | null;
  public createdDate: Date;
  public updatedDate: Date | null;
}
