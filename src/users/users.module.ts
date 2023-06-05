import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import UsersRepository from '@/users/users.repository';
import VpnRepository from '@/vpn/vpn.repository';

@Module({
  providers: [UsersService, UsersRepository, VpnRepository],
  exports: [UsersService],
})
export class UsersModule {}
