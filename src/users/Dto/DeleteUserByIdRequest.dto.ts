import { ApiProperty } from '@nestjs/swagger';

export default class DeleteUserByIdRequestDto {
  @ApiProperty({
    type: 'number',
    example: '1',
  })
  id: number;
}
