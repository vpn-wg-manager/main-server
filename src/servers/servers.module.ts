import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import ServersRepository from '@/servers/servers.repository';
import VpnRepository from '@/vpn/vpn.repository';

@Module({
  providers: [ServersService, ServersRepository, VpnRepository],
  exports: [ServersService],
})
export class ServersModule {}
