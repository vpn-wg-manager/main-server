import VpnRepository from '@/vpn/vpn.repository';
import { UserRole } from '@/users/constants';
import CreateVpnRequest from '@/vpn/Requests/CreateVpn.request';
import VpnEntity from '@/vpn/vpn.entity';
import { capitalizeFirstLetter } from '@/shared/helpers/capitalize';
import { VpnStatus } from '@/vpn/constants';
import { customAlphabet } from 'nanoid';
import Error, { ErrorTypes } from '@/shared/Errors/Error';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import ServersRepository from '@/servers/servers.repository';
import VpnOrm from '@/vpn/vpn.orm';
import UsersOrm from '@/users/users.orm';
import ServersOrm from '@/servers/servers.orm';
import ServersEntity from '@/servers/servers.entity';

const nameMaxLength = 20;
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz');

export class CreateVpnUseCase {
  freeSpaceServer: ServersEntity;

  constructor(
    private vpnRepository: VpnRepository,
    private readonly httpService: HttpService,
    private serverRepository: ServersRepository,
    private userRole: UserRole,
    private userId: number,
  ) {}

  async do(request: CreateVpnRequest) {
    try {
      await this.validate(request);
      const vpnsData: Partial<VpnOrm>[] = await this.prepareData(request);
      // const response = await this.sendToServer(request, vpnsData);
      const result = await this.vpnRepository.createNewVpns(vpnsData);
      return result;
    } catch (e) {
      throw e;
    }
  }

  async validate(request: CreateVpnRequest) {
    if (this.userRole === UserRole.Client) {
      throw new Error(ErrorTypes.noPermission, 'role', 'No permission');
    }
  }

  async prepareData(request: CreateVpnRequest) {
    const vpnsData: Partial<VpnOrm>[] = [];
    const { data: servers } = await this.serverRepository.getServers();
    const freeSpaceServer = servers.find((server) => server.availableSlots > 0);
    if (!freeSpaceServer) {
      throw new Error(ErrorTypes.noSlots, 'server', 'Servers are full');
    }
    this.freeSpaceServer = freeSpaceServer;
    for (let i = 0; i < request.count; i++) {
      const name = `${request.prefix.replace(/[^A-Za-z]/gim, '')}${nanoid(
        nameMaxLength - request.prefix.length,
      )}`;
      const user = new UsersOrm();
      user.id = this.userId;
      const server = new ServersOrm();
      server.id = this.freeSpaceServer.id;
      vpnsData.push({
        user,
        name: capitalizeFirstLetter(name),
        server,
        forUserEmail: request.forUserEmail,
        status: VpnStatus.WaitForApprove,
        approvedDate: null,
        waitForApproveFromDate: new Date(),
        disabledDate: null,
        createdDate: new Date(),
        updatedDate: null,
      });
    }
    return vpnsData;
  }

  async sendToServer(
    request: CreateVpnRequest,
    vpnsData: Partial<VpnEntity>[],
  ): Promise<AxiosResponse<any, any>> {
    const data = vpnsData.map((el) => ({
      name: el.name,
      email: el.forUserEmail,
    }));
    const response = await this.httpService.axiosRef.post(
      `http://${this.freeSpaceServer.addr}/user`,
      {
        data,
      },
    );
    return response;
  }
}
