import ServersEntity from '@/servers/servers.entity';

export interface IServersRepository {
  createServer(name: string, addr: string): Promise<ServersEntity>;

  getServerByName(name: string): Promise<ServersEntity>;

  deleteServerByName(name: string): Promise<boolean>;
}
