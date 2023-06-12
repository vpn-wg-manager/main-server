import UsersOrm from '@/users/users.orm';
import UsersEntity from '@/users/users.entity';
import UserDto from '@/users/Dto/User.dto';
import { NonFunctionProperties } from '@/types';

export default class UsersMapper {
  static ormToDomain(orm: UsersOrm): UsersEntity {
    return UsersEntity.new({
      id: orm.id,
      email: orm.email,
      phone: orm.phone,
      name: orm.name,
      balance: orm.balance,
      password: orm.password,
      role: orm.role,
      totalVpnsInvites: orm.totalVpnsInvites,
    });
  }

  static ormListToDomain(orms: UsersOrm[]): UsersEntity[] {
    const res = [];
    for (const orm of orms) {
      res.push(this.ormToDomain(orm));
    }
    return res;
  }

  static domainToDto(
    user: UsersEntity | Partial<NonFunctionProperties<UsersEntity>>,
  ): UserDto {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      // balance: user.balance,
      role: user.role,
      totalVpnsInvites: user.totalVpnsInvites,
    };
  }

  static domainListToDto(users: UsersEntity[]): UserDto[] {
    const res = [];
    for (const user of users) {
      res.push(this.domainToDto(user));
    }
    return res;
  }
}
