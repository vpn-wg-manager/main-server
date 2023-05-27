import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateServerRequestDto {
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
}
