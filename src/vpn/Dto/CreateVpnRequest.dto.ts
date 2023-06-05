import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export default class CreateVpnRequestDto {
  @MaxLength(30)
  @IsString()
  @ApiProperty({
    type: 'string',
    maxLength: 30,
    example: '255.255.255.255:12345',
  })
  serverAddr: string;

  @MaxLength(40)
  @IsString()
  @IsEmail()
  @ApiProperty({
    type: 'string',
    maxLength: 40,
    example: 'example@mail.com',
  })
  forUserEmail: string;

  @IsNumber()
  @Max(10)
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    type: 'number',
    required: false,
    default: 1,
    example: 2,
  })
  count?: number;

  @IsString()
  @MaxLength(10)
  @IsOptional()
  @ApiProperty({
    type: 'string',
    required: false,
    default: '',
    example: 'MyVpn',
  })
  prefix?: string;
}
