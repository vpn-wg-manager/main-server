import ServersRepository from '@/servers/servers.repository';
import CreateServerRequest from '@/servers/Requests/CreateServer.request';
import { UserRole } from '@/users/constants';
import Error, { ErrorTypes } from '@/shared/Errors/Error';

export default class CreateServerUseCase {
  constructor(
    private serversRepository: ServersRepository,
    private role: UserRole,
  ) {}

  async do(request: CreateServerRequest) {
    try {
      await this.validate(request);
      return this.serversRepository.createServer(
        request.name,
        request.addr,
        request.maxUsers,
      );
    } catch (e) {
      throw e;
    }
  }

  async validate(request: CreateServerRequest) {
    if (this.role !== UserRole.SuperAdmin) {
      throw new Error(ErrorTypes.noPermission, 'role', 'No permission');
    }

    const serverByName = await this.serversRepository.getServerBy(
      'name',
      request.name,
    );
    if (serverByName) {
      throw new Error(
        ErrorTypes.exists,
        'name',
        'Server with such name already exists',
      );
    }
    const serverByAddr = await this.serversRepository.getServerBy(
      'addr',
      request.addr,
    );
    if (serverByAddr) {
      throw new Error(
        ErrorTypes.exists,
        'addr',
        'Server with such address already exists',
      );
    }
    if (!request.name) {
      throw new Error(
        ErrorTypes.required,
        'name',
        'Required field "name" not present',
      );
    }
    if (!request.addr) {
      throw new Error(
        ErrorTypes.required,
        'addr',
        'Required field "addr" not present',
      );
    }
  }
}
