import {
  IsString,
  MaxLength,
  IsDate,
  IsNumber,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UniqueIdentifier } from '@/types';
import { VpnStatus } from '@/vpn/constants';

export default class VpnDto {
  @IsNumber()
  @ApiProperty({ type: 'number', example: 1 })
  id: UniqueIdentifier;

  @IsNumber()
  @ApiProperty({ type: 'number', example: 1 })
  createdByUserId: number;

  @IsString()
  @MaxLength(20)
  @ApiProperty({ type: 'string', example: 'MyBestVpn' })
  name: string;

  @IsString()
  @MaxLength(30)
  @ApiProperty({ type: 'string', example: '255.255.255.255:12345' })
  serverAddr: string;

  @IsString()
  @MaxLength(40)
  @IsEmail()
  @ApiProperty({ type: 'string', example: 'example@mail.com' })
  forUserEmail: string;

  @ApiProperty({
    type: 'enum',
    enum: VpnStatus,
    example: VpnStatus.WaitForApprove,
    default: VpnStatus.WaitForApprove,
  })
  status: VpnStatus;

  @IsDate()
  approvedDate: Date;

  @IsDate()
  waitForApproveFromDate: Date;

  @IsDate()
  disabledDate: Date;

  @IsDate()
  createdDate: Date;

  @IsDate()
  updatedDate: Date | null;
}
