import { ApiProperty } from '@nestjs/swagger';

export default class GetUserByEmailRequestDto {
  @ApiProperty({
    type: 'string',
    example: 'example@mail.com',
  })
  email: string;
}
