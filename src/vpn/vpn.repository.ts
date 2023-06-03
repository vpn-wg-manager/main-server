import { Injectable } from '@nestjs/common';
import IVpnRepository from '@/vpn/IVpnRepository';
import { Connection } from 'typeorm';
import VpnOrm from '@/vpn/vpn.orm';
import { VpnStatus } from '@/vpn/constants';
import VpnEntity from '@/vpn/vpn.entity';
import VpnMapper from '@/vpn/vpn.mapper';

@Injectable()
export default class VpnRepository implements IVpnRepository {
  constructor(private readonly connection: Connection) {}

  async createNewVpns(vpnsData: Partial<VpnEntity>[]): Promise<VpnEntity[]> {
    const vpns = VpnOrm.create(vpnsData);
    const res = await VpnOrm.insert(vpns);
    return VpnMapper.ormsListToDomain(res.generatedMaps as VpnOrm[]);
  }

  async totalVpnsOnAddr(addr: string) {
    return this.connection.manager.count(VpnOrm, {
      where: {
        serverAddr: addr,
      },
    });
  }

  async getVpns(userId?: number): Promise<VpnEntity[]> {
    let params;
    if (userId) {
      params = {
        where: {
          createdByUserId: userId,
        },
      };
    }
    const vpns = await this.connection.manager.find(VpnOrm, params);
    return VpnMapper.ormsListToDomain(vpns);
  }

  async findVpnByName(name: string): Promise<VpnEntity> {
    const vpn = await this.connection.manager.findOne(VpnOrm, {
      where: {
        name,
      },
    });
    return VpnMapper.ormToDomain(vpn);
  }

  async updateVpnStatus(
    name: string,
    status: VpnStatus,
    disabledDate: Date,
  ): Promise<VpnEntity> {
    const updated: Partial<VpnEntity> = {
      status,
      disabledDate,
      updatedDate: new Date(),
    };
    if (status !== VpnStatus.WaitForApprove) {
      updated.waitForApproveFromDate = null;
    } else {
      updated.waitForApproveFromDate = new Date();
    }
    if (status === VpnStatus.Disabled) {
      updated.disabledDate = null;
    }
    if (status === VpnStatus.Approved) {
      updated.approvedDate = new Date();
    } else {
      updated.approvedDate = null;
    }
    const update = await this.connection.manager.update(
      VpnOrm,
      {
        name,
      },
      updated,
    );
    if (update) {
      return this.findVpnByName(name);
    }
  }
}
