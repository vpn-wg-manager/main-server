import { Injectable } from '@nestjs/common';
import UsersRepository from '@/users/users.repository';
import CreateUserUseCase from '@/users/UseCase/CreateUserUseCase';
import GetUserByIdUseCase from '@/users/UseCase/GetUserByIdUseCase';
import GetUserByEmailUseCase from '@/users/UseCase/GetUserByEmailUseCase';
import GetUsersUseCase from '@/users/UseCase/GetUsersUseCase';
import UpdateUserRoleUseCase from '@/users/UseCase/UpdateUserRoleUseCase';
import { UserRole } from '@/users/constants';
import DeleteUserByIdUseCase from '@/users/UseCase/DeleteUserByIdUseCase';
import VpnRepository from '@/vpn/vpn.repository';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UsersRepository,
    private vpnRepository: VpnRepository,
  ) {}

  async createNewUserUseCase() {
    return new CreateUserUseCase(this.userRepository);
  }

  async getUserByIdUseCase() {
    return new GetUserByIdUseCase(this.userRepository);
  }

  async deleteUserByIdUseCase(userRole: UserRole) {
    return new DeleteUserByIdUseCase(
      this.userRepository,
      this.vpnRepository,
      userRole,
    );
  }

  async getUserByEmailUseCase() {
    return new GetUserByEmailUseCase(this.userRepository);
  }

  async getUsersUseCase(userRole: UserRole) {
    return new GetUsersUseCase(this.userRepository, userRole);
  }

  async updateUserRoleUseCase(userRole: UserRole) {
    return new UpdateUserRoleUseCase(this.userRepository, userRole);
  }
}
