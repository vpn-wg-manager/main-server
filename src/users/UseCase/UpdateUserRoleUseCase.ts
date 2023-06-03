import { IUsersRepository } from '@/users/IUsersRepository';
import UsersEntity from '@/users/users.entity';
import Error, { ErrorTypes } from '@/shared/Errors/Error';
import { UserRole } from '@/users/constants';
import UpdateUserRoleRequest from '@/users/Requests/UpdateUserRole.request';

export default class UpdateUserRoleUseCase {
  constructor(
    public userRepository: IUsersRepository,
    public userRole: UserRole,
  ) {}

  async do(request: UpdateUserRoleRequest): Promise<UsersEntity> {
    try {
      await this.validate(request);
      const user = await this.userRepository.updateUserRole(
        request.role,
        request.userId,
      );
      return user;
    } catch (e) {
      throw e;
    }
  }

  async validate(request: UpdateUserRoleRequest) {
    const user = await this.userRepository.getUserById(request.userId);
    if (this.userRole !== UserRole.SuperAdmin) {
      throw new Error(ErrorTypes.noPermission, 'role', 'No permission');
    }
    if (!user) {
      throw new Error(ErrorTypes.notExists, 'user', 'User not exists!');
    }
  }
}
