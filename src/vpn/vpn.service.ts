import { Inject, Injectable } from '@nestjs/common';
import CreateVpnRequest from '@/vpn/Requests/CreateVpn.request';
import VpnRepository from '@/vpn/vpn.repository';
import { REQUEST } from '@nestjs/core';
import { UserRole } from '@/users/constants';
import UpdateVpnStatusRequest from '@/vpn/Requests/UpdateVpnStatus.request';
import VpnEntity from '@/vpn/vpn.entity';
import { RemoteVpnStatus, VpnStatus } from '@/vpn/constants';
import { customAlphabet } from 'nanoid';
import { HttpService } from '@nestjs/axios';
import { capitalizeFirstLetter } from '@/helpers/capitalize';

const nameMaxLength = 20;
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz');

@Injectable()
export class VpnService {
  constructor(
    @Inject(REQUEST) private readonly req: any,
    private vpnRepository: VpnRepository,
    private readonly httpService: HttpService,
  ) {}

  async createNewVpns(request: CreateVpnRequest) {
    const userId = this.req.user.id;
    try {
      const vpnsData: Partial<VpnEntity>[] = [];
      for (let i = 0; i < request.count; i++) {
        const name = `${request.prefix.replace(/[^A-Za-z]/gim, '')}${nanoid(
          nameMaxLength - request.prefix.length,
        )}`;
        vpnsData.push({
          createdByUserId: userId,
          name: capitalizeFirstLetter(name),
          serverAddr: request.serverAddr,
          forUserEmail: request.forUserEmail,
          status: VpnStatus.WaitForApprove,
          approvedDate: null,
          waitForApproveFromDate: new Date(),
          disabledDate: null,
          createdDate: new Date(),
          updatedDate: null,
        });
      }
      const result = await this.vpnRepository.createNewVpns(vpnsData);
      const response = await this.httpService.axiosRef.post(
        `http://${request.serverAddr}/user`,
        {
          data: vpnsData.map((el) => ({
            name: el.name,
            email: el.forUserEmail,
          })),
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  async getVpns() {
    const userRole = this.req.user.role;
    const userId = this.req.user.id;
    try {
      if (userRole === UserRole.SuperAdmin) {
        return this.vpnRepository.getVpns();
      } else if (userRole === UserRole.Manager) {
        return this.vpnRepository.getVpns(userId);
      }
    } catch (e) {
      throw e;
    }
  }

  async updateVpnStatus(request: UpdateVpnStatusRequest) {
    const userRole = this.req.user.role;
    try {
      if (userRole !== UserRole.SuperAdmin) return;
      await this.updateRemoteVpnStatus(request);
      return this.vpnRepository.updateVpnStatus(request.name, request.status);
    } catch (e) {
      throw e;
    }
  }

  async updateRemoteVpnStatus(request: UpdateVpnStatusRequest) {
    const vpn = await this.vpnRepository.findVpnByName(request.name);
    let action: RemoteVpnStatus | undefined;
    if (request.status === VpnStatus.Approved) {
      action = RemoteVpnStatus.Enabled;
    }
    if (request.status === VpnStatus.Disabled) {
      action = RemoteVpnStatus.Disabled;
    }
    if (action) {
      const res = await this.httpService.axiosRef.put(
        `http://${vpn.serverAddr}/user`,
        {
          data: {
            names: [vpn.name],
            action,
          },
        },
      );
    }
  }
}
