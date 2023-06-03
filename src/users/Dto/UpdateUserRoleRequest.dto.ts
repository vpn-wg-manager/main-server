import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from '@/users/constants';

export class UpdateUserRoleRequestPathDto {
  @ApiProperty({
    type: 'number',
    example: '1',
  })
  id: number;
}

export class UpdateUserRoleRequestBodyDto {
  @IsEnum(UserRole)
  @ApiProperty({
    type: 'enum',
    example: UserRole.Manager,
  })
  role: UserRole;
}
