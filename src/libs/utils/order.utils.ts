import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import { ORDER_STEP } from '@/libs/constants/order.constants';
import { isNull } from '@/libs/utils/check.utils';

export function calculateOrderByIndex(index: number): number {
  return (Math.floor(index) + 1) * ORDER_STEP;
}

export function calculateIntermediateOrder(previousOrder: number, nextOrder: number): number {
  if (isNull(previousOrder) || isNull(nextOrder))
    throw new Error(EXCEPTION_MESSAGES.paramsNotFound);

  return Math.floor((previousOrder + nextOrder) / 2);
}

export function needResetOrders(previousOrder: number, nextOrder: number): boolean {
  if (isNull(previousOrder) || isNull(nextOrder))
    throw new Error(EXCEPTION_MESSAGES.paramsNotFound);

  return nextOrder - previousOrder <= 1;
}
