import { TValidationErrors } from './error.types';

export type TSuccessResponse<TData = undefined> = {
  isSuccess: boolean;
  data?: TData;
};

export type TErrorResponse = {
  statusCode: number | string;
  message: string;
};

export type TValidationErrorResponse<T> = TErrorResponse & {
  validation: TValidationErrors<T>;
};
