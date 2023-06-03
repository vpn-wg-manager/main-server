import VpnEntity from '@/vpn/vpn.entity';

export default interface IVpnRepository {
  createNewVpns(vpnsData: Partial<VpnEntity[]>): Promise<VpnEntity[]>;

  getVpns(userId?: number): Promise<VpnEntity[]>;
}
