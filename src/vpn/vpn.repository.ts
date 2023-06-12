import { Injectable } from '@nestjs/common';
import IVpnRepository from '@/vpn/IVpnRepository';
import { Connection, DeepPartial, FindManyOptions, ILike, In } from 'typeorm';
import VpnOrm from '@/vpn/vpn.orm';
import { VpnStatus } from '@/vpn/constants';
import VpnEntity from '@/vpn/vpn.entity';
import VpnMapper from '@/vpn/vpn.mapper';

import { Page, PageParams } from '@/shared/types';
import { GetVpnsParams } from '@/vpn/vpn.types';
import ServersOrm from '@/servers/servers.orm';

@Injectable()
export default class VpnRepository implements IVpnRepository {
  constructor(private readonly connection: Connection) {}

  async createNewVpns(vpnsData: DeepPartial<VpnOrm>[]): Promise<VpnEntity[]> {
    const vpns = VpnOrm.create(vpnsData);
    const res = await VpnOrm.insert(vpns);
    return this.getVpnsByIds(res.generatedMaps.map((el) => el.id));
  }

  async totalApprovedVpnsOnAddr(addr: string) {
    return this.connection.manager.count(VpnOrm, {
      relations: ['server'],
      where: {
        server: { addr },
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
      { user: { name: ILike('%' + query + '%') } },
    ];
    const paramsInner: FindManyOptions<VpnOrm> = {
      where,
      relations: ['user', 'server'],
      order: { createdDate: 'DESC' },
      take,
      skip,
    };
    if (userId) {
      paramsInner.where = [
        { name: ILike('%' + query + '%'), user: { id: userId } },
        { forUserEmail: ILike('%' + query + '%'), user: { id: userId } },
      ];
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

  async getVpnsByIds(ids: number[]): Promise<VpnEntity[]> {
    const vpns = await this.connection.manager.find(VpnOrm, {
      relations: ['user', 'server'],
      where: { id: In(ids) },
    });
    return VpnMapper.ormsListToDomain(vpns);
  }

  async findVpnByName(name: string): Promise<VpnEntity> {
    const vpn = await this.connection.manager.findOne(VpnOrm, {
      relations: ['server', 'user'],
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
    serverId?: number,
  ): Promise<VpnEntity> {
    const updated: Partial<VpnEntity> = {
      status,
      disabledDate,
      updatedDate: new Date(),
    };
    if (serverId) {
      const server = new ServersOrm();
      server.id = serverId;
      updated.server = server;
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
