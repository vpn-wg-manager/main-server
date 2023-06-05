import UsersRepository from '@/users/users.repository';
import Error, { ErrorTypes } from '@/shared/Errors/Error';
import DeleteUserByIdRequest from '@/users/Requests/DeleteUserById.request';
import { UserRole } from '@/users/constants';
import VpnRepository from '@/vpn/vpn.repository';

export default class DeleteUserByIdUseCase {
  constructor(
    private userRepository: UsersRepository,
    private vpnRepository: VpnRepository,
    private userRole: UserRole,
  ) {}

  async do(request: DeleteUserByIdRequest) {
    try {
      await this.validate(request);
      await this.vpnRepository.deleteVpnByField('createdByUserId', request.id);
      const user = await this.userRepository.deleteUserById(request.id);
      if (user) {
        return true;
      }
    } catch (e) {
      throw new Error(ErrorTypes.notExists, 'id', 'No such user');
    }
  }

  async validate(request: DeleteUserByIdRequest) {
    const user = await this.userRepository.getUserById(request.id);
    if (this.userRole !== UserRole.SuperAdmin) {
      throw new Error(ErrorTypes.noPermission, 'role', 'No permission');
    }
    if (!user) {
      throw new Error(ErrorTypes.notExists, 'user', 'User not exists!');
    }
    if (!request.id) {
      throw new Error(ErrorTypes.required, 'id', 'not present id');
    }
  }
}
