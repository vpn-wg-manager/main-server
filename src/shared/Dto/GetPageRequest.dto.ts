import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export default class GetPageRequestDto {
  @IsString()
  @ApiProperty({
    type: 'number',
    minimum: 1,
    example: 1,
  })
  page: number;

  @IsString()
  @ApiProperty({
    required: true,
    type: 'number',
    minimum: 1,
    example: 5,
  })
  count;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string',
    example: 'hellokitty',
  })
  query;
}
