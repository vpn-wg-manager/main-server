import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { VpnStatus } from '@/vpn/constants';

export default class UpdateVpnStatusRequestDto {
  @IsEnum(VpnStatus)
  @ApiProperty({
    type: 'enum',
    example: VpnStatus.WaitForApprove,
  })
  status: VpnStatus;
}
