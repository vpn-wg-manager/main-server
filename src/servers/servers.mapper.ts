import ServersOrm from '@/servers/servers.orm';
import ServersEntity from '@/servers/servers.entity';
import ServerDto from '@/servers/Dto/Server.dto';
import { NonFunctionProperties } from '@/types';

export default class ServersMapper {
  static ormToDomain(orm: ServersOrm): ServersEntity {
    return ServersEntity.new({
      id: orm.id,
      name: orm.name,
      addr: orm.addr,
      maxUsers: orm.maxUsers,
      availableSlots: orm.availableSlots,
      createdDate: orm.createdDate,
      updatedDate: orm.updatedDate,
    });
  }

  static ormsListToDomain(list: ServersOrm[]): ServersEntity[] {
    return list.map((orm) => ServersMapper.ormToDomain(orm));
  }

  static domainToDto(
    server: ServersEntity | Partial<NonFunctionProperties<ServersEntity>>,
  ): ServerDto {
    return {
      id: server.id,
      name: server.name,
      addr: server.addr,
      maxUsers: server.maxUsers,
      availableSlots: server.availableSlots,
      createdDate: server.createdDate,
      updatedDate: server.updatedDate,
    };
  }

  static domainsListToDto(list: ServersEntity[]): ServerDto[] {
    return list.map((domain) => ServersMapper.domainToDto(domain));
  }
}
