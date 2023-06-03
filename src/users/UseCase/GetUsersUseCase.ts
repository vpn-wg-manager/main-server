import UsersRepository from '@/users/users.repository';
import Error, { ErrorTypes } from '@/shared/Errors/Error';
import { UserRole } from '@/users/constants';

export default class GetUsersUseCase {
  constructor(
    private userRepository: UsersRepository,
    private userRole: string,
  ) {}

  async do() {
    try {
      await this.validate();
      const users = await this.userRepository.getUsers();
      if (users.length) {
        return users;
      } else {
        throw new Error(ErrorTypes.notExists, 'users', 'No users');
      }
    } catch (e) {
      throw new Error(ErrorTypes.notExists, 'users', 'No users');
    }
  }

  async validate() {
    if (this.userRole !== UserRole.SuperAdmin) {
      throw new Error(ErrorTypes.noPermission, 'role', 'No permission');
    }
  }
}
