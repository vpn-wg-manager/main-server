import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from '@/users/users.controller';
import UsersRepository from '@/users/users.repository';
import { UsersService } from '@/users/users.service';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { ServersModule } from './servers/servers.module';
import { ServersController } from '@/servers/servers.controller';
import { ServersService } from '@/servers/servers.service';
import { VpnModule } from './vpn/vpn.module';
import ServersRepository from '@/servers/servers.repository';
import { VpnController } from '@/vpn/vpn.controller';
import { VpnService } from '@/vpn/vpn.service';
import VpnRepository from '@/vpn/vpn.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    ServersModule,
    VpnModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [UsersController, ServersController, VpnController],
  providers: [
    UsersService,
    UsersRepository,
    ServersService,
    ServersRepository,
    VpnService,
    VpnRepository,
  ],
})
export class AppModule {}
