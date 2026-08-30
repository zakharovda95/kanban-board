import { isNullOrUndefined } from '@kanban-board/common';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';

export default class OrderUtility {
  private static ORDER_STEP = 1000;

  public static calculateOrderByIndex(index: number): number {
    if (isNullOrUndefined(index)) throw new Error(EXCEPTION_MESSAGES.paramsNotFound);
    return (Math.floor(index) + 1) * this.ORDER_STEP;
  }

  public static calculateIntermediateOrder(previousOrder: number, nextOrder: number): number {
    if (isNullOrUndefined(previousOrder) || isNullOrUndefined(nextOrder))
      throw new Error(EXCEPTION_MESSAGES.paramsNotFound);
    return Math.floor((previousOrder + nextOrder) / 2);
  }

  public static calculateNextOrder(order: number): number {
    if (isNullOrUndefined(order)) throw new Error(EXCEPTION_MESSAGES.paramsNotFound);
    return order + this.ORDER_STEP;
  }

  public static needResetOrders(previousOrder: number, nextOrder: number): boolean {
    if (isNullOrUndefined(previousOrder) || isNullOrUndefined(nextOrder))
      throw new Error(EXCEPTION_MESSAGES.paramsNotFound);
    return nextOrder - previousOrder <= 1;
  }
}
