import { Module } from '@nestjs/common';
import { VpnService } from './vpn.service';
import VpnRepository from '@/vpn/vpn.repository';
import { HttpModule } from '@nestjs/axios';
import ServersRepository from '@/servers/servers.repository';

@Module({
  imports: [HttpModule],
  providers: [VpnService, VpnRepository, ServersRepository],
  exports: [VpnService],
})
export class VpnModule {}
