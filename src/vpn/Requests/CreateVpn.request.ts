export default class CreateVpnRequest {
  constructor(
    public forUserEmail: string,
    public count?: number,
    public prefix?: string,
  ) {}
}
