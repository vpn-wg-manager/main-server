import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServersService } from '@/servers/servers.service';
import CreateServerRequestDto from '@/servers/Dto/CreateServerRequest.dto';
import ServerDto from '@/servers/Dto/Server.dto';
import CreateServerRequest from '@/servers/Requests/CreateServer.request';
import ServersMapper from '@/servers/servers.mapper';
import GetServerByNameRequest from '@/servers/Requests/GetServerByName.request';
import GetServerByNameRequestDto from '@/servers/Dto/GetServerByNameRequest.dto';
import DeleteServerByNameRequest from '@/servers/Requests/DeleteServerByName.request';
import DeleteServerByNameRequestDto from '@/servers/Dto/DeleteServerByNameRequest.dto';

@Controller('servers')
@ApiTags('Servers')
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: CreateServerRequestDto })
  @ApiResponse({ type: ServerDto })
  async createServer(@Body() body: CreateServerRequestDto) {
    const request = new CreateServerRequest(body.name, body.addr);
    const server = await this.serversService.createNewServer(request);
    return ServersMapper.domainToDto(server);
  }

  @Get('/:name')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ type: ServerDto })
  async getServerByName(@Query() query: GetServerByNameRequestDto) {
    const request = new GetServerByNameRequest(query.name);
    const server = await this.serversService.getServerByName(request);
    return ServersMapper.domainToDto(server);
  }

  @Delete('/:name')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ type: Boolean })
  async deleteServerByName(@Query() query: DeleteServerByNameRequestDto) {
    const request = new DeleteServerByNameRequest(query.name);
    const server = await this.serversService.deleteServerByName(request);
    return server;
  }

  @Get()
  @ApiResponse({ type: ServerDto, isArray: true })
  async getServersList() {
    const servers = await this.serversService.getServers();
    return ServersMapper.domainsListToDto(servers);
  }
}
