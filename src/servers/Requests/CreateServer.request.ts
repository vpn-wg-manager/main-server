export default class CreateServerRequest {
  constructor(
    public name: string,
    public addr: string,
    public maxUsers: number,
  ) {}
}
