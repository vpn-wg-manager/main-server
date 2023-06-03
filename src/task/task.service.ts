import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import VpnRepository from '@/vpn/vpn.repository';
import * as dayjs from 'dayjs';
import { VpnStatus } from '@/vpn/constants';

@Injectable()
export class TaskService {
  constructor(private vpnRepository: VpnRepository) {}

  @Cron('45 * * * * *')
  async handleCron() {
    const vpns = await this.vpnRepository.getVpns();
    const shouldBeDisabledVpns = vpns.filter((vpn) => {
      return dayjs().isAfter(vpn.disabledDate);
    });
    for (const vpn of shouldBeDisabledVpns) {
      await this.vpnRepository.updateVpnStatus(
        vpn.name,
        VpnStatus.Disabled,
        null,
      );
    }
  }
}
