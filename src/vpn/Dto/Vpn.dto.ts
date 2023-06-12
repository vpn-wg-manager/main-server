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
import UserDto from '@/users/Dto/User.dto';
import ServerDto from '@/servers/Dto/Server.dto';

export default class VpnDto {
  @IsNumber()
  @ApiProperty({ type: 'number', example: 1 })
  id: UniqueIdentifier;

  @ApiProperty({
    type: 'string',
    example: 'Jerry',
  })
  userName: string;

  @IsString()
  @MaxLength(20)
  @ApiProperty({ type: 'string', example: 'MyBestVpn' })
  name: string;

  @ApiProperty({ type: 'string', example: 'Batman' })
  serverName: string;

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
