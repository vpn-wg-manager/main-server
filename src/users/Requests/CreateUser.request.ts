export default class CreateUser {
  constructor(
    public email: string,
    public phone: string,
    public pass: string,
    public passRepeat: string,
    public name: string,
  ) {}
}
