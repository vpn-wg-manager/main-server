import VpnRepository from '@/vpn/vpn.repository';
import { UserRole } from '@/users/constants';
import Error, { ErrorTypes } from '@/shared/Errors/Error';
import UpdateVpnStatusRequest from '@/vpn/Requests/UpdateVpnStatus.request';
import { RemoteVpnStatus, VpnStatus } from '@/vpn/constants';
import * as dayjs from 'dayjs';
import { HttpService } from '@nestjs/axios';
import ServersRepository from '@/servers/servers.repository';
import ServersEntity from '@/servers/servers.entity';

export class UpdateVpnStatusUseCase {
  freeSpaceServer: ServersEntity;

  constructor(
    private readonly httpService: HttpService,
    private vpnRepository: VpnRepository,
    private serversRepository: ServersRepository,
    private userRole: UserRole,
  ) {}

  async do(request: UpdateVpnStatusRequest) {
    try {
      await this.validate(request);
      let disabledDate = request.disabledDate;
      if (this.userRole === UserRole.Manager || !request.disabledDate) {
        disabledDate = dayjs().add(1, 'month').toDate();
      }
      if (request.status === VpnStatus.Approved) {
        const vpn = await this.vpnRepository.findVpnByName(request.name);
        const { data: servers } = await this.serversRepository.getServers();

        const currentServer = servers.find(
          (server) =>
            server.addr === vpn.server.addr && server.availableSlots > 0,
        );
        if (currentServer) {
          this.freeSpaceServer = currentServer;
        } else {
          const freeSpaceServer = servers.find(
            (server) => server.availableSlots > 0,
          );
          if (!freeSpaceServer) {
            throw new Error(ErrorTypes.noSlots, 'server', 'Servers are full');
          }
          this.freeSpaceServer = freeSpaceServer;
        }

        // await this.updateRemote(request);
        return this.vpnRepository.updateVpnStatus(
          request.name,
          request.status,
          disabledDate,
          this.freeSpaceServer.id,
        );
      }
      // await this.updateRemote(request);
      return this.vpnRepository.updateVpnStatus(
        request.name,
        request.status,
        disabledDate,
      );
    } catch (e) {
      throw e;
    }
  }

  async validate(request: UpdateVpnStatusRequest) {
    if (![UserRole.SuperAdmin, UserRole.Manager].includes(this.userRole)) {
      throw new Error(ErrorTypes.noPermission, 'role');
    }

    if (
      this.userRole !== UserRole.SuperAdmin &&
      request.status === VpnStatus.Disabled
    ) {
      throw new Error(ErrorTypes.noPermission, 'role', "You can't disable!");
    }

    if (this.userRole === UserRole.Manager && request.disabledDate) {
      throw new Error(
        ErrorTypes.noPermission,
        'role',
        'You cant specify disabled date!',
      );
    }

    if (request.disabledDate && dayjs().isAfter(dayjs(request.disabledDate))) {
      throw new Error(
        ErrorTypes.wrongValue,
        'disabledDate',
        'Disabled date cant be less than the current date',
      );
    }
  }

  async updateRemote(request: UpdateVpnStatusRequest) {
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
        `http://${this.freeSpaceServer.addr}/user`,
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
