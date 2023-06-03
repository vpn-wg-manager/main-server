import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '@/users/constants';

export default class CreateUserRequestDto {
  @MaxLength(30)
  @IsEmail()
  @ApiProperty({
    type: 'string',
    maxLength: 30,
    example: 'hellokitty@gmail.com',
  })
  email: string;

  @MinLength(10)
  @MaxLength(15)
  @IsString()
  @ApiProperty({
    type: 'string',
    minLength: 10,
    maxLength: 15,
    example: '79353535355',
  })
  phone: string;

  @MinLength(6)
  @MaxLength(80)
  @IsString()
  @ApiProperty({
    type: 'string',
    maxLength: 80,
    example: 'Verystrongpassword1',
  })
  pass: string;

  @MinLength(6)
  @MaxLength(80)
  @IsString()
  @ApiProperty({
    type: 'string',
    maxLength: 80,
    example: 'Verystrongpassword1',
  })
  passRepeat: string;

  @MaxLength(20)
  @IsString()
  @ApiProperty({
    type: 'string',
    maxLength: 20,
    example: 'Jerry',
  })
  name: string;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty({
    type: 'enum',
    default: UserRole.Client,
    example: UserRole.Manager,
  })
  role: UserRole;
}
