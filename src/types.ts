export type UniqueIdentifier = string | number;

export enum Operation {
  ok = 'ok',
  fail = 'fail',
}

export default abstract class BaseEntity<T> {
  static new<T>(this: new () => T, params: NonFunctionProperties<T>): T {
    return Object.assign(new this(), params);
  }
}

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

type NonFunctionPropertyNames<O> = {
  [K in keyof O]: O[K] extends Function ? never : K;
}[keyof O];
