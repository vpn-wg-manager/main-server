import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsOptional } from 'class-validator';
import { VpnStatus } from '@/vpn/constants';

export default class UpdateVpnStatusRequestDto {
  @IsEnum(VpnStatus)
  @ApiProperty({
    type: 'enum',
    example: VpnStatus.WaitForApprove,
  })
  status: VpnStatus;

  @IsISO8601()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: new Date(),
  })
  disabledDate?: Date;
}
