import { ORDER_STEP } from '@/libs/constants/order.constants';

export function calculateNextOrder(index: number): number {
  return (Math.floor(index) + 1) * ORDER_STEP;
}

export function calculateIntermediateOrder(previousOrder: number, nextOrder: number): number {
  if (!previousOrder && !nextOrder) throw new Error('Не переданы значения');
  return Math.floor((previousOrder + nextOrder) / 2);
}

export function needResetOrders(previousOrder: number, nextOrder: number): boolean {
  if (!previousOrder || !nextOrder) throw new Error('Не переданы значения');
  return nextOrder - previousOrder <= 1;
}
