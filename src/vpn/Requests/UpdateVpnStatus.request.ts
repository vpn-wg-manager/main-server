import { VpnStatus } from '@/vpn/constants';

export default class UpdateVpnStatusRequest {
  constructor(
    public name: string,
    public status: VpnStatus,
    public disabledDate?: Date,
  ) {}
}
