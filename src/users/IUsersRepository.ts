import UsersEntity from '@/users/users.entity';
import { UserRole } from '@/users/constants';

export interface IUsersRepository {
  createUser(
    email: string,
    phone: string,
    password: string,
    name: string,
    role: UserRole,
  ): Promise<UsersEntity>;

  // getUsers(): Promise<UsersEntity[]>;
  //
  getUserById(id: number): Promise<UsersEntity>;
  //
  // getUserByName(name: string): Promise<UsersEntity>;
  //
  // editUser(
  //   id: UniqueIdentifier,
  //   email?: string,
  //   pass?: string,
  //   name?: string,
  // ): Promise<UsersEntity>;
  //
  // deleteUser(id: UniqueIdentifier): Promise<DeleteUserResponseDto>;
}
