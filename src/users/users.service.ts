import { Injectable } from '@nestjs/common';
import UsersRepository from '@/users/users.repository';
import UsersEntity from '@/users/users.entity';
import CreateUser from '@/users/Requests/CreateUser.request';
import GetUserByIdRequest from '@/users/Requests/GetUserById.request';
import { UserRole } from '@/users/constants';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  createNewUserUseCase(request: CreateUser) {
    try {
      const passHash = UsersEntity.hashPassword(request.pass);
      const defaultRole = UserRole.Manager;
      return this.userRepository.createUser(
        request.email,
        request.phone,
        passHash,
        request.name,
        defaultRole,
      );
    } catch (e) {
      throw e;
    }
  }
  //
  // getUsers() {
  //   return new GetUsersUseCase(this.userRepository);
  // }
  //
  async getUserById(request: GetUserByIdRequest) {
    const user = await this.userRepository.getUserById(request.id);
    if (user) {
      return user;
    }
  }
  //
  async getUserByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      return user;
    }
  }
  //
  // editUser() {
  //   return new EditUserUseCase(this.userRepository);
  // }
  //
  // deleteUser() {
  //   return new DeleteUserUseCase(this.userRepository);
  // }
}
