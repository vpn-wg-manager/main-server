import ServersRepository from '@/servers/servers.repository';
import { UserRole } from '@/users/constants';
import Error, { ErrorTypes } from '@/shared/Errors/Error';

export default class GetServersUseCase {
  constructor(
    private serversRepository: ServersRepository,
    private role: UserRole,
  ) {}

  async do() {
    try {
      await this.validate();
      const servers = await this.serversRepository.getServers();
      return servers;
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
