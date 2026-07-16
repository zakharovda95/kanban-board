export type TSuccessResponse<TData = undefined> = {
  isSuccess: boolean;
  data?: TData | undefined;
};

export type TValidationErrors<T> = {
  [K in keyof T]?: T[K] extends object ? TValidationErrors<T[K]> : string[];
};
