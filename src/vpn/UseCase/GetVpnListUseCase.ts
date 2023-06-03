import VpnRepository from '@/vpn/vpn.repository';
import { UserRole } from '@/users/constants';
import Error, { ErrorTypes } from '@/shared/Errors/Error';

export class GetVpnListUseCase {
  constructor(
    private vpnRepository: VpnRepository,
    private userRole: UserRole,
    private userId: number,
  ) {}

  async do() {
    try {
      await this.validate();
      if (this.userRole === UserRole.SuperAdmin) {
        return this.vpnRepository.getVpns();
      } else if (this.userRole === UserRole.Manager) {
        return this.vpnRepository.getVpns(this.userId);
      }
    } catch (e) {
      throw e;
    }
  }

  async validate() {
    if (![UserRole.SuperAdmin, UserRole.Manager].includes(this.userRole)) {
      throw new Error(ErrorTypes.noPermission, 'role');
    }
  }
}
