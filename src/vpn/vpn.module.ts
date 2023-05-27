import { Module } from '@nestjs/common';
import { VpnService } from './vpn.service';
import VpnRepository from '@/vpn/vpn.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [VpnService, VpnRepository],
  exports: [VpnService],
})
export class VpnModule {}
