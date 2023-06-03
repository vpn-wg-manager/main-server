import BaseEntity from '@/types';

export default class ServersEntity extends BaseEntity<ServersEntity> {
  readonly id: number;
  public name: string;
  public addr: string;
  public maxUsers: number;
  public availableSlots?: number;
  public createdDate: Date;
  public updatedDate: Date;
}
