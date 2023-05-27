import { IsString, MaxLength, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UniqueIdentifier } from '@/types';

export default class ServerDto {
  @ApiProperty({ type: 'number', example: 1 })
  id: UniqueIdentifier;

  @MaxLength(20)
  @IsString()
  @ApiProperty({
    type: 'string',
    maxLength: 20,
    example: 'My Best Server Ever',
  })
  name: string;

  @MaxLength(30)
  @IsString()
  @ApiProperty({
    type: 'string',
    maxLength: 30,
    example: '255.255.255.255:12345',
  })
  addr: string;

  @IsDate()
  createdDate: Date;

  @IsDate()
  updatedDate: Date | null;
}
