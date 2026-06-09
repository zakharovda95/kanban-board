import { TSuccessResponse } from '@/libs/types/response.types';

export class ResponseUtils {
  public static getSuccessResponse(): TSuccessResponse {
    return { isSuccess: true };
  }

  public static getSuccessResponseWithData<TData>(data: TData): TSuccessResponse<TData> {
    return { ...this.getSuccessResponse(), data };
  }
}
