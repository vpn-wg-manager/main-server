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

  //
  // async getUsers(): Promise<UsersEntity[]> {
  //   const users = await this.connection.manager.find(UsersOrm);
  //   return UsersMapper.ormListToDomain(users);
  // }
  //
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
  //
  // async getUserByName(name: string): Promise<UsersEntity> {
  //   const user = await this.connection.manager.findOne(UsersOrm, {
  //     where: {
  //       name,
  //     },
  //   });
  //   if (user) {
  //     return UsersMapper.ormToDomain(user);
  //   }
  // }
  //
  // async editUser(
  //   id: UniqueIdentifier,
  //   email?: string,
  //   pass?: string,
  //   name?: string,
  // ): Promise<UsersEntity> {
  //   const editable = nonNullable({
  //     name,
  //     email,
  //     password: pass,
  //   });
  //   const edit = await this.connection.manager.update(
  //     UsersOrm,
  //     {
  //       id,
  //     },
  //     editable,
  //   );
  //
  //   if (edit.affected) {
  //     return this.getUserById(id);
  //   }
  // }
  //
  // async deleteUser(id: UniqueIdentifier): Promise<DeleteUserResponseDto> {
  //   const deletedUser = await this.connection.manager.update(
  //     UsersOrm,
  //     { id },
  //     { deleted_at: new Date() },
  //   );
  //   if (deletedUser.affected) {
  //     return { status: Operation.ok };
  //   }
  //   return { status: Operation.fail };
  // }
}
