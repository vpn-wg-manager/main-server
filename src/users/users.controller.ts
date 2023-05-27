import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import CreateUserRequest from '@/users/Requests/CreateUser.request';
import CreateUserRequestDto from '@/users/Dto/CreateUserRequest.dto';
import UserDto from '@/users/Dto/User.dto';
import UsersMapper from '@/users/users.mapper';
import GetUserByIdRequest from '@/users/Requests/GetUserById.request';
import GetUserByIdRequestDto from '@/users/Dto/GetUserByIdRequest.dto';
import { LocalAuthGuard } from '@/auth/local-auth.guard';
import SignInDto from '@/users/Dto/SignIn.dto';
import { AuthService } from '@/auth/auth.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('createUser')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: CreateUserRequestDto })
  @ApiResponse({ type: UserDto })
  async createUser(@Body() body: CreateUserRequestDto) {
    const request = new CreateUserRequest(
      body.email,
      body.phone,
      body.pass,
      body.passRepeat,
      body.name,
    );
    const user = await this.usersService.createNewUserUseCase(request);
    return UsersMapper.domainToDto(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signIn')
  @ApiBody({ type: SignInDto })
  @ApiResponse({ type: UserDto })
  async signIn(@Request() req: any) {
    return this.authService.signIn(req.user);
  }

  // @Get()
  // @ApiResponse({ type: [UserDto] })
  // async getUsers() {
  //   const useCase = this.usersService.getUsers();
  //   const users = await useCase.do();
  //   return UsersMapper.domainListToDto(users);
  // }

  // @Get('find')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // @ApiResponse({ type: UserDto })
  // async getUserByName(@Query() query: GetUserByNameRequestDto) {
  //   const request = new GetUserByNameRequest(query.name);
  //   const useCase = this.usersService.getUserByName();
  //   const user = await useCase.do(request);
  //   return UsersMapper.domainToDto(user);
  // }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ type: UserDto })
  async getUserById(@Param() path: GetUserByIdRequestDto) {
    const request = new GetUserByIdRequest(path.id);
    const user = await this.usersService.getUserById(request);
    return UsersMapper.domainToDto(user);
  }

  // @Patch('/:id/edit')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // @ApiBody({ type: EditUserRequestDto })
  // @ApiResponse({ type: UserDto })
  // async editUser(@Param('id') id: number, @Body() body: EditUserRequestDto) {
  //   const request = new EditUserRequest(id, body.email, body.pass, body.name);
  //   const useCase = this.usersService.editUser();
  //   const user = await useCase.do(request);
  //   return UsersMapper.domainToDto(user);
  // }
  //
  // @Delete('/:id')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // @ApiResponse({ type: String })
  // async deleteUser(@Param('id') id: number) {
  //   const request = new DeleteUserRequest(id);
  //   const useCase = this.usersService.deleteUser();
  //   return await useCase.do(request);
  // }
}
