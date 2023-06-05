import { Injectable } from '@nestjs/common';
import { Connection, Equal, FindManyOptions, Like, Raw } from 'typeorm';
import ServersOrm from '@/servers/servers.orm';
import { IServersRepository } from '@/servers/IServersRepository';
import ServersEntity from '@/servers/servers.entity';
import ServersMapper from '@/servers/servers.mapper';
import { Page, PageParams } from '@/shared/types';

@Injectable()
export default class ServersRepository implements IServersRepository {
  constructor(private readonly connection: Connection) {}

  async createServer(
    name: string,
    addr: string,
    maxUsers: number,
  ): Promise<ServersEntity> {
    const server = this.connection.manager.create(ServersOrm, {
      name,
      addr,
      maxUsers,
      createdDate: new Date(),
      updatedDate: null,
    });
    await server.save();
    return ServersMapper.ormToDomain(server);
  }

  async getServerBy(field: string, value: string): Promise<ServersEntity> {
    const server = await this.connection.manager.findOne(ServersOrm, {
      where: {
        [field]: value,
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

  async getServers(params?: PageParams): Promise<Page<ServersEntity[]>> {
    const take = params?.count || 10;
    const skip = (params?.page - 1) * take || 0;
    const query = params?.query || '';
    const where = [
      { name: Like('%' + query + '%') },
      { addr: Like('%' + query + '%') },
    ];
    const paramsInner: FindManyOptions<ServersOrm> = {
      where,
      order: { name: 'DESC' },
      take,
      skip,
    };
    const [servers, count] = await this.connection.manager.findAndCount(
      ServersOrm,
      paramsInner,
    );
    return {
      data: ServersMapper.ormsListToDomain(servers),
      count,
    };
  }
}
