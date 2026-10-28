export type Json = object | string | number | boolean | null;

export type WithoutNulls<T> = { [K in keyof T as null extends T[K] ? never : K]: T[K] } & {
  [K in keyof T as null extends T[K] ? K : never]?: Exclude<T[K], null>;
};
