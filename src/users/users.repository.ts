import { Injectable } from '@nestjs/common';
import UsersEntity from '@/users/users.entity';
import UsersMapper from '@/users/users.mapper';
import UsersOrm from '@/users/users.orm';
import { IUsersRepository } from '@/users/IUsersRepository';
import { Connection } from 'typeorm';
import { UserRole } from '@/users/constants';

@Injectable()
export default class UsersRepository implements IUsersRepository {
  constructor(private readonly connection: Connection) {}

  async createUser(
    email: string,
    phone: string,
    pass: string,
    name: string,
    role: UserRole,
  ): Promise<UsersEntity> {
    const user = this.connection.manager.create(UsersOrm, {
      email,
      phone,
      password: pass,
      name,
      role,
    });
    await user.save();
    return UsersMapper.ormToDomain(user);
  }

  async findByEmail(email: string, withDeleted = false): Promise<UsersEntity> {
    const user = await this.connection.manager.findOne(UsersOrm, {
      where: {
        email,
      },
      withDeleted,
    });
    if (user) {
      return UsersMapper.ormToDomain(user);
    }
  }

  async getUserCount(): Promise<number> {
    const count = await UsersOrm.count();
    return count || 0;
  }

  async getUserById(id: number): Promise<UsersEntity> {
    const user = await this.connection.manager.findOne(UsersOrm, {
      where: {
        id,
      },
    });
    if (user) {
      return UsersMapper.ormToDomain(user);
    }
  }

  async getUsers(): Promise<UsersEntity[]> {
    const users = await this.connection.manager.find(UsersOrm);
    if (users) {
      return UsersMapper.ormListToDomain(users);
    }
  }

  async updateUserRole(newRole: UserRole, id: number): Promise<UsersEntity> {
    const update = await this.connection.manager.update(
      UsersOrm,
      { id },
      { role: newRole },
    );
    if (update) {
      return this.getUserById(id);
    }
  }
}
