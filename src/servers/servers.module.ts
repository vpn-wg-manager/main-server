import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import ServersRepository from '@/servers/servers.repository';

@Module({
  providers: [ServersService, ServersRepository],
  exports: [ServersService],
})
export class ServersModule {}
