export type TSuccessResponse<TData = undefined> = {
  isSuccess: boolean;
  data?: TData | undefined;
};

export type TErrorResponse = {
  statusCode: number;
  message: string;
};

export type TValidationErrors<T> = {
  [K in keyof T]?: T[K] extends object ? TValidationErrors<T[K]> : string[];
};

export type TValidationErrorResponse<T> = TErrorResponse & {
  validation: TValidationErrors<T>;
};
