import {
  Request,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Get,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VpnService } from '@/vpn/vpn.service';
import VpnDto from '@/vpn/Dto/Vpn.dto';
import CreateVpnRequestDto from '@/vpn/Dto/CreateVpnRequest.dto';
import CreateVpnRequest from '@/vpn/Requests/CreateVpn.request';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import VpnMapper from '@/vpn/vpn.mapper';
import UpdateVpnStatusRequestDto from '@/vpn/Dto/UpdateVpnStatusRequest.dto';
import UpdateVpnStatusRequest from '@/vpn/Requests/UpdateVpnStatus.request';

@Controller('vpn')
@ApiTags('Vpn')
export class VpnController {
  constructor(private vpnService: VpnService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: CreateVpnRequestDto })
  @ApiResponse({ type: VpnDto, isArray: true })
  async createVpn(@Body() body: CreateVpnRequestDto) {
    const request = new CreateVpnRequest(
      body.serverAddr,
      body.forUserEmail,
      body.count,
      body.prefix,
    );
    const vpns = await this.vpnService.createNewVpns(request);
    // return VpnMapper.domainsListToDto(servers);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiResponse({ type: VpnDto, isArray: true })
  async getVpnList(@Request() req: any) {
    const vpns = await this.vpnService.getVpns();
    return VpnMapper.domainsListToDto(vpns);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('/:name/status')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: UpdateVpnStatusRequestDto })
  @ApiResponse({ type: VpnDto, isArray: true })
  async updateVpnStatus(
    @Query('name') name: string,
    @Body() body: UpdateVpnStatusRequestDto,
  ) {
    const request = new UpdateVpnStatusRequest(name, body.status);
    const vpn = await this.vpnService.updateVpnStatus(request);
    return VpnMapper.domainToDto(vpn);
  }
}
