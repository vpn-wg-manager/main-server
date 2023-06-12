import { ApiProperty } from '@nestjs/swagger';
import { UniqueIdentifier } from '@/types';
import { UserRole } from '@/users/constants';

export default class UserDto {
  @ApiProperty({ type: 'number', example: 1 })
  id: UniqueIdentifier;

  @ApiProperty({ type: 'string', example: 'Jerry' })
  name: string;

  // @ApiProperty({ type: 'string', example: '0.00' })
  // balance: string;

  @ApiProperty({
    type: 'string',
    example: 'hellokitty@gmail.com',
  })
  email: string;

  @ApiProperty({
    type: 'string',
    example: '79353535355',
  })
  phone: string;

  @ApiProperty({
    type: 'enum',
    example: UserRole.Manager,
  })
  role: UserRole;

  @ApiProperty({
    type: 'integer',
    example: 18,
  })
  totalVpnsInvites: number;
}
