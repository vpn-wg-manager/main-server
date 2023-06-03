import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import UsersEntity from '@/users/users.entity';
import GetUserByIdRequest from '@/users/Requests/GetUserById.request';
import GetUserByEmailRequest from '@/users/Requests/GetUserByEmail.request';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const request = new GetUserByEmailRequest(email);
    const useCase = await this.usersService.getUserByEmailUseCase();
    const user = await useCase.do(request);
    if (user && user.validatePassword(pass)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserById(id: number): Promise<UsersEntity | undefined> {
    const request = new GetUserByIdRequest(id);

    const useCase = await this.usersService.getUserByIdUseCase();
    return useCase.do(request);
  }

  async getUserByToken(token: any) {
    return this.jwtService.decode(token);
  }
}
