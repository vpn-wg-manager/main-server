import ServersRepository from '@/servers/servers.repository';
import { UserRole } from '@/users/constants';
import Error, { ErrorTypes } from '@/shared/Errors/Error';
import VpnRepository from '@/vpn/vpn.repository';
import GetServersRequest from '@/servers/Requests/GetServers.request';

export default class GetServersUseCase {
  constructor(
    private serversRepository: ServersRepository,
    private vpnRepository: VpnRepository,
    private role: UserRole,
  ) {}

  async do(request: GetServersRequest) {
    try {
      await this.validate();

      const servers = await this.serversRepository.getServers(request);
      const mappedServers = [];
      for (const server of servers.data) {
        const totalVpnsOnAddr =
          await this.vpnRepository.totalApprovedVpnsOnAddr(server.addr);
        mappedServers.push({
          ...server,
          availableSlots: server.maxUsers - totalVpnsOnAddr,
        });
      }
      return { data: mappedServers, count: servers.count };
    } catch (e) {
      throw e;
    }
  }

  async validate() {
    if (![UserRole.SuperAdmin, UserRole.Manager].includes(this.role)) {
      throw new Error(ErrorTypes.noPermission, 'role', 'No permission');
    }
  }
}
