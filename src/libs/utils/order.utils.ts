import { ORDER_STEP } from '@/libs/constants/order.constants';

export function calculateIntermediateOrder(previousOrder: number, nextOrder: number): number {
  if (!previousOrder && !nextOrder) throw new Error('Не переданы значения');
  return Math.floor((previousOrder + nextOrder) / 2);
}

export function needResetOrders(previousOrder: number, nextOrder: number): boolean {
  if (!previousOrder || !nextOrder) throw new Error('Не переданы значения');
  return nextOrder - previousOrder <= 1;
}

export function getNextOrder(lastOrder: number): number {
  return (lastOrder + 1) * ORDER_STEP;
}
