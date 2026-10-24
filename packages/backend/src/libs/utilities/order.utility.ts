import { isNullOrUndefined } from '@kanban-board/common';

export type TMaxOrderResult = { maxOrder: number | null };

export default class OrderUtility {
  private static ORDER_STEP = 1000;

  public static calculateOrderByIndex(index: number): number {
    if (isNullOrUndefined(index))
      throw new Error('Не передан индекс для расчёта порядкового значения');
    return (Math.floor(index) + 1) * this.ORDER_STEP;
  }

  public static calculateIntermediateOrder(previousOrder: number, nextOrder: number): number {
    if (isNullOrUndefined(previousOrder) || isNullOrUndefined(nextOrder))
      throw new Error('Не переданы соседние порядковые значения для расчёта промежуточной позиции');
    return Math.floor((previousOrder + nextOrder) / 2);
  }

  public static calculateNextOrder(order: number): number {
    if (isNullOrUndefined(order))
      throw new Error('Не передано порядковое значение для расчёта следующей позиции');
    if (order < this.ORDER_STEP) return this.ORDER_STEP;
    return Math.floor(order / this.ORDER_STEP) * this.ORDER_STEP + this.ORDER_STEP;
  }

  public static needResetOrders(previousOrder: number, nextOrder: number): boolean {
    if (isNullOrUndefined(previousOrder) || isNullOrUndefined(nextOrder))
      throw new Error(
        'Не переданы соседние порядковые значения для проверки необходимости нормализации',
      );
    return nextOrder - previousOrder <= 1;
  }
}
