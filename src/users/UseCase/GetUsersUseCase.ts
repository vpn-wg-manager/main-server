import UsersRepository from '@/users/users.repository';
import Error, { ErrorTypes } from '@/shared/Errors/Error';
import { UserRole } from '@/users/constants';
import GetUsersRequest from '@/users/Requests/GetUsers.request';

export default class GetUsersUseCase {
  constructor(
    private userRepository: UsersRepository,
    private userRole: string,
  ) {}

  async do(request: GetUsersRequest) {
    try {
      await this.validate();
      const users = await this.userRepository.getUsers(request);
      return users;
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
