import * as crypto from 'crypto';
import { ConfigModule } from '@nestjs/config';
import BaseEntity from '../types';
import { UserRole } from '@/users/constants';
ConfigModule.forRoot();

const passwordSalt = process.env.USER_PASS_SALT;

export default class UsersEntity extends BaseEntity<UsersEntity> {
  readonly id: number;
  public email: string;
  public phone: string;
  public password: string;
  public name: string;
  public balance: string;
  public role: UserRole;

  setEmail(email: string) {
    this.email = email;
  }

  setPassword(password: string) {
    this.password = password;
  }

  static hashPassword(password: string) {
    return crypto
      .createHash('md5')
      .update(password + passwordSalt)
      .digest('hex');
  }

  validatePassword(password: string) {
    return UsersEntity.hashPassword(password) === this.password;
  }
}
