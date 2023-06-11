import VpnOrm from '@/vpn/vpn.orm';
import VpnEntity from '@/vpn/vpn.entity';
import VpnDto from '@/vpn/Dto/Vpn.dto';
import UsersMapper from '@/users/users.mapper';

export default class VpnMapper {
  static ormToDomain(orm: VpnOrm): VpnEntity {
    return VpnEntity.new({
      id: orm.id,
      user: orm.user,
      name: orm.name,
      serverAddr: orm.serverAddr,
      forUserEmail: orm.forUserEmail,
      status: orm.status,
      approvedDate: orm.approvedDate,
      waitForApproveFromDate: orm.waitForApproveFromDate,
      disabledDate: orm.disabledDate,
      createdDate: orm.createdDate,
      updatedDate: orm.updatedDate,
    });
  }

  static ormsListToDomain(list: VpnOrm[]): VpnEntity[] {
    return list.map((orm) => VpnMapper.ormToDomain(orm));
  }

  static domainToDto(vpn: VpnEntity): VpnDto {
    return {
      id: vpn.id,
      user: UsersMapper.domainToDto(vpn.user),
      name: vpn.name,
      serverAddr: vpn.serverAddr,
      forUserEmail: vpn.forUserEmail,
      status: vpn.status,
      approvedDate: vpn.approvedDate,
      waitForApproveFromDate: vpn.waitForApproveFromDate,
      disabledDate: vpn.disabledDate,
      createdDate: vpn.createdDate,
      updatedDate: vpn.updatedDate,
    };
  }

  static domainsListToDto(list: VpnEntity[]): VpnDto[] {
    return list.map((domain) => VpnMapper.domainToDto(domain));
  }
}
