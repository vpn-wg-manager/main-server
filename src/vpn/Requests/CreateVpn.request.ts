export default class CreateVpnRequest {
  constructor(
    public serverAddr: string,
    public forUserEmail: string,
    public count?: number,
    public prefix?: string,
  ) {}
}
