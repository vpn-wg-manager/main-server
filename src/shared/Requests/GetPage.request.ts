export default class GetPageRequest {
  constructor(
    public page: number,
    public count: number,
    public query?: string,
  ) {}
}
