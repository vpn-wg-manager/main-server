import { Inject, Injectable } from '@nestjs/common';
import ServersRepository from '@/servers/servers.repository';
import GetServerByNameRequest from '@/servers/Requests/GetServerByName.request';
import DeleteServerByNameRequest from '@/servers/Requests/DeleteServerByName.request';
import { REQUEST } from '@nestjs/core';
import { UserRole } from '@/users/constants';
import CreateServerUseCase from '@/servers/UseCase/CreateServerUseCase';
import DeleteServerByNameUseCase from '@/servers/UseCase/DeleteServerByNameUseCase';
import GetServerByNameUseCase from '@/servers/UseCase/GetServerByNameUseCase';
import GetServersUseCase from '@/servers/UseCase/GetServersUseCase';
import VpnRepository from '@/vpn/vpn.repository';

@Injectable()
export class ServersService {
  constructor(
    @Inject(REQUEST) private readonly req: any,
    private serversRepository: ServersRepository,
    private vpnRepository: VpnRepository,
  ) {}

  async createNewServerUseCase() {
    const userRole = this.req.user.role;
    return new CreateServerUseCase(this.serversRepository, userRole);
  }

  async getServerByNameUseCase() {
    const userRole = this.req.user.role;
    return new GetServerByNameUseCase(
      this.serversRepository,
      this.vpnRepository,
      userRole,
    );
  }

  async deleteServerByNameUseCase() {
    const userRole = this.req.user.role;
    return new DeleteServerByNameUseCase(this.serversRepository, userRole);
  }

  async getServersUseCase() {
    const userRole = this.req.user.role;
    return new GetServersUseCase(
      this.serversRepository,
      this.vpnRepository,
      userRole,
    );
  }
}
