import { Injectable } from '@nestjs/common';
import IVpnRepository from '@/vpn/IVpnRepository';
import { Connection, FindManyOptions, ILike, Like, Raw } from 'typeorm';
import VpnOrm from '@/vpn/vpn.orm';
import { VpnStatus } from '@/vpn/constants';
import VpnEntity from '@/vpn/vpn.entity';
import VpnMapper from '@/vpn/vpn.mapper';

import { Page, PageParams } from '@/shared/types';
import { GetVpnsParams } from '@/vpn/vpn.types';

@Injectable()
export default class VpnRepository implements IVpnRepository {
  constructor(private readonly connection: Connection) {}

  async createNewVpns(vpnsData: Partial<VpnEntity>[]): Promise<VpnEntity[]> {
    const vpns = VpnOrm.create(vpnsData);
    const res = await VpnOrm.insert(vpns);
    return VpnMapper.ormsListToDomain(res.generatedMaps as VpnOrm[]);
  }

  async totalApprovedVpnsOnAddr(addr: string) {
    return this.connection.manager.count(VpnOrm, {
      where: {
        serverAddr: addr,
        status: VpnStatus.Approved,
      },
    });
  }

  async totalApprovedVpns() {
    return this.connection.manager.count(VpnOrm, {
      where: {
        status: VpnStatus.Approved,
      },
    });
  }

  async getVpns(
    userId?: number,
    params?: PageParams<GetVpnsParams>,
  ): Promise<Page<VpnEntity[]>> {
    const take = params?.count || 10;
    const skip = (params?.page - 1) * take || 0;
    const query = params?.query?.toLowerCase().trim() || '';
    const where = [
      { name: ILike('%' + query + '%') },
      { forUserEmail: ILike('%' + query + '%') },
    ];
    const paramsInner: FindManyOptions<VpnOrm> = {
      where,
      order: { name: 'DESC' },
      take,
      skip,
    };
    if (userId) {
      paramsInner.where = {
        where,
        createdByUserId: userId,
      };
    }
    const [vpns, count] = await this.connection.manager.findAndCount(
      VpnOrm,
      paramsInner,
    );
    return {
      data: VpnMapper.ormsListToDomain(vpns),
      count,
    };
  }

  async findVpnByName(name: string): Promise<VpnEntity> {
    const vpn = await this.connection.manager.findOne(VpnOrm, {
      where: {
        name,
      },
    });
    return VpnMapper.ormToDomain(vpn);
  }

  async deleteVpnByField(
    field: string,
    value: string | number,
  ): Promise<boolean> {
    const deleted = await this.connection.manager.delete(VpnOrm, {
      [field]: value,
    });
    return !!deleted?.affected;
  }

  async updateVpnStatus(
    name: string,
    status: VpnStatus,
    disabledDate: Date,
    serverAddr?: string,
  ): Promise<VpnEntity> {
    const updated: Partial<VpnEntity> = {
      status,
      disabledDate,
      updatedDate: new Date(),
    };
    if (serverAddr) {
      updated.serverAddr = serverAddr;
    }
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
