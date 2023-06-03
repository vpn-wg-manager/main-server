import ServersRepository from '@/servers/servers.repository';
import { UserRole } from '@/users/constants';
import Error, { ErrorTypes } from '@/shared/Errors/Error';
import VpnRepository from '@/vpn/vpn.repository';

export default class GetServersUseCase {
  constructor(
    private serversRepository: ServersRepository,
    private vpnRepository: VpnRepository,
    private role: UserRole,
  ) {}

  async do() {
    try {
      await this.validate();
      const servers = await this.serversRepository.getServers();
      const mappedServers = [];
      for (const server of servers) {
        const totalVpnsOnAddr =
          await this.vpnRepository.totalApprovedVpnsOnAddr(server.addr);
        mappedServers.push({
          ...server,
          availableSlots: server.maxUsers - totalVpnsOnAddr,
        });
      }
      return mappedServers;
    } catch (e) {
      throw e;
    }
  }

  async validate() {
    if (this.role !== UserRole.SuperAdmin) {
      throw new Error(ErrorTypes.noPermission, 'role', 'No permission');
    }
  }
}
