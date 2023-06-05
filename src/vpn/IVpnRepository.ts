import VpnEntity from '@/vpn/vpn.entity';

import { Page } from '@/shared/types';

export default interface IVpnRepository {
  createNewVpns(vpnsData: Partial<VpnEntity[]>): Promise<VpnEntity[]>;

  getVpns(userId?: number, params?: any): Promise<Page<VpnEntity[]>>;
}
