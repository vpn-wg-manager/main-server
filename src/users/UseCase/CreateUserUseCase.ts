import { IUsersRepository } from '@/users/IUsersRepository';
import UsersEntity from '@/users/users.entity';
import CreateUser from '@/users/Requests/CreateUser.request';
import Error, { ErrorTypes } from '@/shared/Errors/Error';
import { UserRole } from '@/users/constants';

export default class CreateUserUseCase {
  constructor(public userRepository: IUsersRepository) {}

  async do(request: CreateUser): Promise<UsersEntity> {
    try {
      await this.validate(request);
      const isUsersExists = await this.userRepository.getUserCount();
      const passHash = UsersEntity.hashPassword(request.pass);
      const defaultRole = isUsersExists ? UserRole.Client : UserRole.SuperAdmin;
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

  async validate(request: CreateUser) {
    if (request.pass !== request.passRepeat) {
      throw new Error(
        ErrorTypes.notEqual,
        'pass',
        'not equal password and password repeat',
      );
    }
    const user = await this.userRepository.findByEmail(request.email);
    if (user) {
      throw new Error(ErrorTypes.exists, 'user', 'User exists!');
    }
  }
}
