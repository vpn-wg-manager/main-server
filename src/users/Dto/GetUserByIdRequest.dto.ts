import { ApiProperty } from '@nestjs/swagger';

export default class GetUserByIdRequestDto {
  @ApiProperty({
    type: 'number',
    example: '1',
  })
  id: number;
}
