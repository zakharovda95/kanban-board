import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import { isNull, isNullOrUndefined } from '@/libs/utils/check.utils';
import { ORDER_STEP } from '@/modules/libs/constants/move.constants';
import { TMovable, TMoveDirection } from '@/modules/libs/types/move.types';

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

  /** Получить соседние доски, между которыми будет помещена перемещаемая доска. **/
  public static getAdjacent<T extends TMovable>(
    collection: T[],
    searchableId: number,
    direction: TMoveDirection,
  ): [T | undefined, T | undefined] {
    if (!searchableId || !direction) throw new Error(EXCEPTION_MESSAGES.paramsNotFound);
    const searchableIndex = collection.findIndex(({ id }) => id === searchableId);

    if (searchableIndex < 0) return [undefined, undefined];

    const adjacentIndex = direction === 'previous' ? searchableIndex + 1 : searchableIndex - 1;

    const searchableBoard = collection[searchableIndex];
    const adjacentBoard = collection[adjacentIndex];

    return [searchableBoard, adjacentBoard];
  }

  public static resetOrders<T extends TMovable>(collection: T[]): void {
    collection.forEach((entity, index) => {
      entity.order = this.calculateOrderByIndex(index);
    });
  }

  public static separateTarget<T extends TMovable>(
    collection: T[],
    targetId: number,
  ): [T | undefined, T[]] {
    if (!collection || !targetId) throw new Error(EXCEPTION_MESSAGES.paramsNotFound);

    const target = collection.find(({ id }) => id === targetId);

    // убираем перемещаемую доску, чтобы не учитывать его при нормализации order и поиске соседей.
    const withoutTarget = collection.filter(({ id }) => id !== targetId);

    return [target, withoutTarget];
  }
}
