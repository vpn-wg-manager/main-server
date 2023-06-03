import { UserRole } from '@/users/constants';

export default class UpdateUserRoleRequest {
  constructor(public role: UserRole, public userId: number) {}
}
