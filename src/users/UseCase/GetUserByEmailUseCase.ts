import UsersRepository from '@/users/users.repository';
import Error, { ErrorTypes } from '@/shared/Errors/Error';
import GetUserByEmailRequest from '@/users/Requests/GetUserByEmail.request';

export default class GetUserByEmailUseCase {
  constructor(private userRepository: UsersRepository) {}

  async do(request: GetUserByEmailRequest) {
    try {
      await this.validate(request);
      const user = await this.userRepository.findByEmail(request.email);
      if (user) {
        return user;
      } else {
        throw new Error(ErrorTypes.notExists, 'email', 'No such user');
      }
    } catch (e) {
      throw new Error(ErrorTypes.notExists, 'email', 'No such user');
    }
  }

  async validate(request: GetUserByEmailRequest) {
    if (!request.email) {
      throw new Error(ErrorTypes.required, 'email', 'not present email');
    }
  }
}
