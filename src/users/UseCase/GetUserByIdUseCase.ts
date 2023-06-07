import GetUserByIdRequest from '@/users/Requests/GetUserById.request';
import UsersRepository from '@/users/users.repository';
import Error, { ErrorTypes } from '@/shared/Errors/Error';

export default class GetUserByIdUseCase {
  constructor(private userRepository: UsersRepository) {}

  async do(request: GetUserByIdRequest) {
    try {
      await this.validate(request);
      const user = await this.userRepository.getUserById(request.id);
      return user || null;
    } catch (e) {
      throw e;
    }
  }

  async validate(request: GetUserByIdRequest) {
    if (!request.id) {
      throw new Error(ErrorTypes.required, 'id', 'not present id');
    }
  }
}
