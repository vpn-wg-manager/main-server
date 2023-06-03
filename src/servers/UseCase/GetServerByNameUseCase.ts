import ServersRepository from '@/servers/servers.repository';
import { UserRole } from '@/users/constants';
import Error, { ErrorTypes } from '@/shared/Errors/Error';
import GetServerByNameRequest from '@/servers/Requests/GetServerByName.request';
import VpnRepository from '@/vpn/vpn.repository';

export default class GetServerByNameUseCase {
  constructor(
    private serversRepository: ServersRepository,
    private vpnRepository: VpnRepository,
    private role: UserRole,
  ) {}

  async do(request: GetServerByNameRequest) {
    try {
      await this.validate(request);
      const serverByName = await this.serversRepository.getServerBy(
        'name',
        request.name,
      );
      if (!serverByName) {
        throw new Error(
          ErrorTypes.notExists,
          'name',
          'Server with such name not exists',
        );
      }
      const totalVpnsOnAddr = await this.vpnRepository.totalApprovedVpnsOnAddr(
        serverByName.addr,
      );
      return {
        ...serverByName,
        availableSlots: serverByName.maxUsers - totalVpnsOnAddr,
      };
    } catch (e) {
      throw e;
    }
  }

  async validate(request: GetServerByNameRequest) {
    if (!request.name) {
      throw new Error(ErrorTypes.notExists, 'name', 'Field "name" not present');
    }

    if (this.role !== UserRole.SuperAdmin) {
      throw new Error(ErrorTypes.noPermission, 'role', 'No permission');
    }
  }
}
