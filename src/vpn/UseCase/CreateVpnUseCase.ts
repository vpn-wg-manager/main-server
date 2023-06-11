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

const nameMaxLength = 20;
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz');

export class CreateVpnUseCase {
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
      const vpnsData: Partial<VpnOrm>[] = this.prepareData(request);
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
    const totalVpnsOnAddr = await this.vpnRepository.totalApprovedVpnsOnAddr(
      request.serverAddr,
    );
    const server = await this.serverRepository.getServerBy(
      'addr',
      request.serverAddr,
    );
    const totalServerSlots = server.maxUsers;
    if (totalServerSlots - totalVpnsOnAddr < request.count) {
      throw new Error(
        ErrorTypes.wrongValue,
        'count',
        'There are not so many empty slots',
      );
    }
  }

  prepareData(request: CreateVpnRequest) {
    const vpnsData: Partial<VpnOrm>[] = [];
    for (let i = 0; i < request.count; i++) {
      const name = `${request.prefix.replace(/[^A-Za-z]/gim, '')}${nanoid(
        nameMaxLength - request.prefix.length,
      )}`;
      const user = new UsersOrm();
      user.id = this.userId;
      vpnsData.push({
        user,
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
      `http://${request.serverAddr}/user`,
      {
        data,
      },
    );
    return response;
  }
}
