import { Injectable } from '@nestjs/common';
import CreateServerRequest from '@/servers/Requests/CreateServer.request';
import ServersRepository from '@/servers/servers.repository';
import GetServerByNameRequest from '@/servers/Requests/GetServerByName.request';
import DeleteServerByNameRequest from '@/servers/Requests/DeleteServerByName.request';

@Injectable()
export class ServersService {
  constructor(private serversRepository: ServersRepository) {}

  async createNewServer(request: CreateServerRequest) {
    try {
      return this.serversRepository.createServer(request.name, request.addr);
    } catch (e) {
      throw e;
    }
  }

  async getServerByName(request: GetServerByNameRequest) {
    try {
      return this.serversRepository.getServerByName(request.name);
    } catch (e) {
      throw e;
    }
  }

  async deleteServerByName(request: DeleteServerByNameRequest) {
    try {
      return this.serversRepository.deleteServerByName(request.name);
    } catch (e) {
      throw e;
    }
  }

  async getServers() {
    try {
      return this.serversRepository.getServers();
    } catch (e) {
      throw e;
    }
  }
}
