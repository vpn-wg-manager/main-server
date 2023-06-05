export interface Page<T> {
  data: T;
  count: number;
}

export interface Paginator {
  page: number;
  count: number;
  query?: string;
}

export type PageParams<T = unknown> = Paginator & T;
