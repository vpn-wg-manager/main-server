import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import VpnRepository from '@/vpn/vpn.repository';
import * as dayjs from 'dayjs';
import { VpnStatus } from '@/vpn/constants';
import { PageParams } from '@/shared/types';
import { GetVpnsParams } from '@/vpn/vpn.types';

@Injectable()
export class TaskService {
  constructor(private vpnRepository: VpnRepository) {}

  @Cron('*/5 * * * * *')
  async handleCron() {
    const approvedVpnsCount = await this.vpnRepository.totalApprovedVpns();

    const count = 300;

    for (let page = 1; page - 1 < approvedVpnsCount / count; page += 1) {
      const params: PageParams<GetVpnsParams> = {
        page,
        count,
      };
      const { data: vpns } = await this.vpnRepository.getVpns(
        undefined,
        params,
      );
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
}
