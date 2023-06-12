import ServersRepository from '@/servers/servers.repository';
import { UserRole } from '@/users/constants';
import DeleteServerByNameRequest from '@/servers/Requests/DeleteServerByName.request';
import Error, { ErrorTypes } from '@/shared/Errors/Error';
import VpnRepository from '@/vpn/vpn.repository';
import ServersOrm from '@/servers/servers.orm';

export default class DeleteServerByNameUseCase {
  server: ServersOrm;
  constructor(
    private serversRepository: ServersRepository,
    private vpnRepository: VpnRepository,
    private role: UserRole,
  ) {}

  async do(request: DeleteServerByNameRequest) {
    try {
      await this.validate(request);
      await this.vpnRepository.deleteVpnByField('server', this.server);
      return this.serversRepository.deleteServerByName(request.name);
    } catch (e) {
      throw e;
    }
  }

  async validate(request: DeleteServerByNameRequest) {
    if (!request.name) {
      throw new Error(ErrorTypes.notExists, 'name', 'Field "name" not present');
    }

    if (this.role !== UserRole.SuperAdmin) {
      throw new Error(ErrorTypes.noPermission, 'role', 'No permission');
    }
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
    } else {
      const server = new ServersOrm();
      server.id = serverByName.id;
      this.server = server;
    }
  }
}
