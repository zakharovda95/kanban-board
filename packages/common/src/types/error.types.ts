export type TValidationErrors<T> = {
  [K in keyof T]?: T[K] extends object ? TValidationErrors<T[K]> : string[];
};
