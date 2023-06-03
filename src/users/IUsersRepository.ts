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

  getUserById(id: number): Promise<UsersEntity>;

  findByEmail(email: string): Promise<UsersEntity>;

  getUserCount(): Promise<number>;

  updateUserRole(newRole: UserRole, id: number): Promise<UsersEntity>;
}
