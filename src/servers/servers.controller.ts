import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServersService } from '@/servers/servers.service';
import CreateServerRequestDto from '@/servers/Dto/CreateServerRequest.dto';
import ServerDto from '@/servers/Dto/Server.dto';
import CreateServerRequest from '@/servers/Requests/CreateServer.request';
import ServersMapper from '@/servers/servers.mapper';
import GetServerByNameRequest from '@/servers/Requests/GetServerByName.request';
import GetServerByNameRequestDto from '@/servers/Dto/GetServerByNameRequest.dto';
import DeleteServerByNameRequest from '@/servers/Requests/DeleteServerByName.request';
import DeleteServerByNameRequestDto from '@/servers/Dto/DeleteServerByNameRequest.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { ErrorExceptionFilter } from '@/error-exception.filter';

@Controller('servers')
@ApiTags('Servers')
export class ServersController {
  constructor(private serversService: ServersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @UseFilters(new ErrorExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: CreateServerRequestDto })
  @ApiResponse({ type: ServerDto })
  async createServer(@Body() body: CreateServerRequestDto) {
    const request = new CreateServerRequest(
      body.name,
      body.addr,
      body.maxUsers,
    );
    const useCase = await this.serversService.createNewServerUseCase();
    const server = await useCase.do(request);
    return ServersMapper.domainToDto(server);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/:name')
  @UseFilters(new ErrorExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ type: ServerDto })
  async getServerByName(@Query() query: GetServerByNameRequestDto) {
    const request = new GetServerByNameRequest(query.name);
    const useCase = await this.serversService.getServerByNameUseCase();
    const server = await useCase.do(request);
    return ServersMapper.domainToDto(server);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/:name')
  @UseFilters(new ErrorExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ type: Boolean })
  async deleteServerByName(@Param() param: DeleteServerByNameRequestDto) {
    const request = new DeleteServerByNameRequest(param.name);
    const useCase = await this.serversService.deleteServerByNameUseCase();
    const server = await useCase.do(request);
    return server;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @UseFilters(new ErrorExceptionFilter())
  @ApiResponse({ type: ServerDto, isArray: true })
  async getServersList() {
    const useCase = await this.serversService.getServersUseCase();
    const servers = await useCase.do();
    return ServersMapper.domainsListToDto(servers);
  }
}
