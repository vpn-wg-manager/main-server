import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
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
import { ErrorExceptionFilter } from '@/error-exception.filter';
import GetVpnsRequestDto from '@/vpn/Dto/GetVpnsRequest.dto';
import GetVpnsRequest from '@/vpn/Requests/GetVpns.request';

@Controller('vpn')
@ApiTags('Vpn')
export class VpnController {
  constructor(private vpnService: VpnService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @UseFilters(new ErrorExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: CreateVpnRequestDto })
  @ApiResponse({ type: VpnDto, isArray: true })
  async createVpn(@Body() body: CreateVpnRequestDto) {
    const request = new CreateVpnRequest(
      body.forUserEmail,
      body.count,
      body.prefix,
    );
    const useCase = await this.vpnService.createNewVpnsUseCase();
    const vpns = await useCase.do(request);
    return VpnMapper.domainsListToDto(vpns);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new ErrorExceptionFilter())
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ type: VpnDto, isArray: true })
  async getVpnList(@Query() query: GetVpnsRequestDto) {
    const request = new GetVpnsRequest(query.page, query.count, query.query);
    const useCase = await this.vpnService.getVpnsUseCase();
    const vpns = await useCase.do(request);
    return { data: VpnMapper.domainsListToDto(vpns.data), count: vpns.count };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('/:name/status')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseFilters(new ErrorExceptionFilter())
  @ApiBody({ type: UpdateVpnStatusRequestDto })
  @ApiResponse({ type: VpnDto, isArray: true })
  async updateVpnStatus(
    @Param('name') name: string,
    @Body() body: UpdateVpnStatusRequestDto,
  ) {
    const request = new UpdateVpnStatusRequest(
      name,
      body.status,
      body.disabledDate,
    );
    const useCase = await this.vpnService.updateVpnStatusUseCase();
    const vpn = await useCase.do(request);
    return VpnMapper.domainToDto(vpn);
  }
}
