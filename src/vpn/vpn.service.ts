import { Inject, Injectable } from '@nestjs/common';
import VpnRepository from '@/vpn/vpn.repository';
import { REQUEST } from '@nestjs/core';
import { UserRole } from '@/users/constants';
import UpdateVpnStatusRequest from '@/vpn/Requests/UpdateVpnStatus.request';
import { RemoteVpnStatus, VpnStatus } from '@/vpn/constants';
import { HttpService } from '@nestjs/axios';
import dayjs from 'dayjs';
import { CreateVpnUseCase } from '@/vpn/UseCase/CreateVpnUseCase';
import { GetVpnListUseCase } from '@/vpn/UseCase/GetVpnListUseCase';
import { UpdateVpnStatusUseCase } from '@/vpn/UseCase/UpdateVpnStatusUseCase';
import ServersRepository from '@/servers/servers.repository';

@Injectable()
export class VpnService {
  constructor(
    @Inject(REQUEST) private readonly req: any,
    private vpnRepository: VpnRepository,
    private readonly httpService: HttpService,
    private serverRepository: ServersRepository,
  ) {}

  async createNewVpnsUseCase() {
    const userId = this.req.user.id;
    const userRole = this.req.user.role;
    return new CreateVpnUseCase(
      this.vpnRepository,
      this.httpService,
      this.serverRepository,
      userRole,
      userId,
    );
  }

  async getVpnsUseCase() {
    const userRole = this.req.user.role;
    const userId = this.req.user.id;
    return new GetVpnListUseCase(this.vpnRepository, userRole, userId);
  }

  async updateVpnStatusUseCase() {
    const userRole = this.req.user.role;
    return new UpdateVpnStatusUseCase(
      this.httpService,
      this.vpnRepository,
      userRole,
    );
  }

  // updateVpnStatusValidate(request: UpdateVpnStatusRequest, userRole: UserRole) {
  //   if (
  //     userRole !== UserRole.SuperAdmin &&
  //     request.status === VpnStatus.Disabled
  //   ) {
  //     throw { error: 'No permission' };
  //   }
  //   if (
  //     request.status === VpnStatus.Approved &&
  //     !request.disabledDate &&
  //     !dayjs().isAfter(dayjs(request.disabledDate))
  //   ) {
  //     throw { error: 'Wrong date!' };
  //   }
  // }
  //
  // async updateRemoteVpnStatus(request: UpdateVpnStatusRequest) {
  //   const vpn = await this.vpnRepository.findVpnByName(request.name);
  //   let action: RemoteVpnStatus | undefined;
  //   if (request.status === VpnStatus.Approved) {
  //     action = RemoteVpnStatus.Enabled;
  //   }
  //   if (request.status === VpnStatus.Disabled) {
  //     action = RemoteVpnStatus.Disabled;
  //   }
  //   if (action) {
  //     const res = await this.httpService.axiosRef.put(
  //       `http://${vpn.serverAddr}/user`,
  //       {
  //         data: {
  //           names: [vpn.name],
  //           action,
  //         },
  //       },
  //     );
  //   }
  // }
}
