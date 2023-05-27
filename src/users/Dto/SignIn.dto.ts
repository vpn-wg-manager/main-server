import { ApiProperty } from '@nestjs/swagger';

export default class SignInDto {
  @ApiProperty({ type: 'string', example: 'hellokitty@gmail.com' })
  email: string;

  @ApiProperty({ type: 'string', example: 'Verystrongpassword1' })
  pass: string;
}
