import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import { isNull, isNullOrUndefined } from '@/libs/utils/check.utils';
import { ORDER_STEP } from '@/modules/libs/constants/move.constants';

export class MoveUtility {
  public static calculateOrderByIndex(index: number): number {
    if (isNullOrUndefined(index)) throw new Error(EXCEPTION_MESSAGES.paramsNotFound);
    return (Math.floor(index) + 1) * ORDER_STEP;
  }

  public static calculateIntermediateOrder(previousOrder: number, nextOrder: number): number {
    if (isNullOrUndefined(previousOrder) || isNullOrUndefined(nextOrder))
      throw new Error(EXCEPTION_MESSAGES.paramsNotFound);
    return Math.floor((previousOrder + nextOrder) / 2);
  }

  public static needResetOrders(previousOrder: number, nextOrder: number): boolean {
    if (isNull(previousOrder) || isNull(nextOrder))
      throw new Error(EXCEPTION_MESSAGES.paramsNotFound);

    return nextOrder - previousOrder <= 1;
  }
}
