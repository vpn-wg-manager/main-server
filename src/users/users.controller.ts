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
  UseFilters,
  Inject,
  Put,
  Query,
} from '@nestjs/common';
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
import { ErrorExceptionFilter } from '@/error-exception.filter';
import GetUserByEmailRequestDto from '@/users/Dto/GetUserByEmailRequest.dto';
import GetUserByEmailRequest from '@/users/Requests/GetUserByEmail.request';
import { REQUEST } from '@nestjs/core';
import {
  UpdateUserRoleRequestBodyDto,
  UpdateUserRoleRequestPathDto,
} from '@/users/Dto/UpdateUserRoleRequest.dto';
import UpdateUserRoleRequest from '@/users/Requests/UpdateUserRole.request';
import DeleteUserByIdRequestDto from '@/users/Dto/DeleteUserByIdRequest.dto';
import DeleteUserByIdRequest from '@/users/Requests/DeleteUserById.request';
import GetUsersRequestDto from '@/users/Dto/GetUsersRequest.dto';
import GetUsersRequest from '@/users/Requests/GetUsers.request';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    @Inject(REQUEST) private readonly req: any,
  ) {}

  @Post('createUser')
  @UseFilters(new ErrorExceptionFilter())
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
    const useCase = await this.usersService.createNewUserUseCase();
    const user = await useCase.do(request);
    return UsersMapper.domainToDto(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signIn')
  @ApiBody({ type: SignInDto })
  @ApiResponse({ type: UserDto })
  async signIn(@Request() req: any) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new ErrorExceptionFilter())
  @Get('userById/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ type: UserDto })
  async getUserById(@Param() path: GetUserByIdRequestDto) {
    const request = new GetUserByIdRequest(path.id);
    const useCase = await this.usersService.getUserByIdUseCase();
    const user = await useCase.do(request);
    return UsersMapper.domainToDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new ErrorExceptionFilter())
  @Get('userById/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ type: UserDto })
  async deleteUserById(@Param() path: DeleteUserByIdRequestDto) {
    const userRole = this.req.user.role;
    const request = new DeleteUserByIdRequest(path.id);
    const useCase = await this.usersService.deleteUserByIdUseCase(userRole);
    const user = await useCase.do(request);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new ErrorExceptionFilter())
  @Get('/current')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ type: UserDto })
  async getCurrentUser() {
    const userId = this.req.user.id;
    const request = new GetUserByIdRequest(userId);
    const useCase = await this.usersService.getUserByIdUseCase();
    const user = await useCase.do(request);
    return UsersMapper.domainToDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new ErrorExceptionFilter())
  @Get('/byEmail/:email')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ type: UserDto })
  async getUserByEmail(@Param() path: GetUserByEmailRequestDto) {
    const request = new GetUserByEmailRequest(path.email);
    const useCase = await this.usersService.getUserByEmailUseCase();
    const user = await useCase.do(request);
    return UsersMapper.domainToDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new ErrorExceptionFilter())
  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ type: UserDto })
  async getUsers(@Query() query: GetUsersRequestDto) {
    const request = new GetUsersRequest(query.page, query.count, query.query);
    const userRole = this.req.user.role;
    const useCase = await this.usersService.getUsersUseCase(userRole);
    const users = await useCase.do(request);
    return {
      data: UsersMapper.domainListToDto(users.data),
      count: users.count,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new ErrorExceptionFilter())
  @Put('userById/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: UpdateUserRoleRequestBodyDto })
  @ApiResponse({ type: UserDto })
  async updateUserRoleById(
    @Param() path: UpdateUserRoleRequestPathDto,
    @Body() body: UpdateUserRoleRequestBodyDto,
  ) {
    const userRole = this.req.user.role;
    const request = new UpdateUserRoleRequest(body.role, path.id);
    const useCase = await this.usersService.updateUserRoleUseCase(userRole);
    const user = await useCase.do(request);
    return UsersMapper.domainToDto(user);
  }
}
