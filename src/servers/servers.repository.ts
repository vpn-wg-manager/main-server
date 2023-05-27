import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import ServersOrm from '@/servers/servers.orm';
import { IServersRepository } from '@/servers/IServersRepository';
import ServersEntity from '@/servers/servers.entity';
import ServersMapper from '@/servers/servers.mapper';

@Injectable()
export default class ServersRepository implements IServersRepository {
  constructor(private readonly connection: Connection) {}

  async createServer(name: string, addr: string): Promise<ServersEntity> {
    const server = this.connection.manager.create(ServersOrm, {
      name,
      addr,
      createdDate: new Date(),
      updatedDate: null,
    });
    await server.save();
    return ServersMapper.ormToDomain(server);
  }

  async getServerByName(name: string): Promise<ServersEntity> {
    const server = await this.connection.manager.findOne(ServersOrm, {
      where: {
        name,
      },
    });
    if (server) {
      return ServersMapper.ormToDomain(server);
    }
  }

  async deleteServerByName(name: string): Promise<boolean> {
    const server = await this.connection.manager.delete(ServersOrm, {
      name,
    });
    if (server) {
      return true;
    }
  }

  async getServers(): Promise<ServersEntity[]> {
    const servers = await this.connection.manager.find(ServersOrm);
    if (servers.length) {
      return ServersMapper.ormsListToDomain(servers);
    }
  }
}
