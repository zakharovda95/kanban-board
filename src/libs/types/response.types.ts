export type TSuccessResponse<TData = undefined> = {
  isSuccess: boolean;
  data?: TData | undefined;
};
