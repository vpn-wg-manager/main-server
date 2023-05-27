import BaseEntity from '@/types';
import { VpnStatus } from '@/vpn/constants';

export default class VpnEntity extends BaseEntity<VpnEntity> {
  readonly id: number;
  public createdByUserId: number;
  public name: string;
  public serverAddr: string;
  public forUserEmail: string;
  public status: VpnStatus;
  public approvedDate: Date | null;
  public waitForApproveFromDate: Date | null;
  public disabledDate: Date | null;
  public createdDate: Date;
  public updatedDate: Date | null;
}
