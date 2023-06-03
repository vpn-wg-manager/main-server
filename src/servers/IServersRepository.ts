import ServersEntity from '@/servers/servers.entity';

export interface IServersRepository {
  createServer(
    name: string,
    addr: string,
    maxUsers: number,
  ): Promise<ServersEntity>;

  getServerBy(field: string, value: string): Promise<ServersEntity>;

  deleteServerByName(name: string): Promise<boolean>;
}
