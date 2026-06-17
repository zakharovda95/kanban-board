import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import { isDefined } from '@/libs/utilities/check.utilities';
import { OrderUtility } from '@/libs/utilities/order.utility';
import {
  TMovable,
  TMoveDirection,
  TMoveParameters,
} from '@/modules/shared/move/libs/types/move.types';

@Injectable()
export class MoveService<T extends TMovable> {
  public tryToMove(entities: T[], targetId: number, parameters: TMoveParameters): void {
    const target = entities.find(({ id }) => id === targetId);
    // убрали перемещаемый объект, для простоты взаимодействия с order других элементов.
    const withoutTarget = entities.filter(({ id }) => id !== targetId);

    if (!target) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);
    if (!withoutTarget.length) throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

    const { previousId, nextId } = parameters;

    if (isDefined(previousId) && previousId) {
      const [previous, next] = this.getAdjacent(withoutTarget, previousId, 'previous');
      if (!previous) throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

      // если нет next, значит помещается в конец (к order последнего элемента в списке прибавляем 1000).
      if (!next) {
        target.order = OrderUtility.calculateNextOrder(previous.order);
        return;
      }

      // Если между previous и next значение order <= 1 - нормализуем порядок.
      if (OrderUtility.needResetOrders(previous.order, next.order)) this.resetOrders(withoutTarget);
      target.order = OrderUtility.calculateIntermediateOrder(previous.order, next.order);
      return;
    }

    // если previousId - null - помещаем в начало.
    if (isDefined(previousId) && !previousId) {
      const first = withoutTarget[0];
      if (OrderUtility.needResetOrders(0, first.order)) this.resetOrders(withoutTarget);
      target.order = OrderUtility.calculateIntermediateOrder(0, first.order);
      return;
    }

    if (isDefined(nextId) && nextId) {
      const [previous, next] = this.getAdjacent(withoutTarget, nextId, 'next');
      if (!next) throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

      // если нет previous, значит перемещаемая помещается в начало.
      if (!previous) {
        target.order = OrderUtility.calculateIntermediateOrder(0, next.order);
        return;
      }

      if (OrderUtility.needResetOrders(previous.order, next.order)) this.resetOrders(withoutTarget);
      target.order = OrderUtility.calculateIntermediateOrder(previous.order, next.order);
      return;
    }

    // если nextId == null - помещаем в конец.
    if (isDefined(nextId) && !nextId) {
      const last = withoutTarget[withoutTarget.length - 1];
      target.order = OrderUtility.calculateNextOrder(last.order);
      return;
    }
  }

  private getAdjacent(
    entities: T[],
    searchableId: number,
    direction: TMoveDirection,
  ): [T | undefined, T | undefined] {
    const searchableIndex = entities.findIndex(({ id }) => id === searchableId);
    if (searchableIndex < 0) return [undefined, undefined];

    const adjacentIndex = direction === 'previous' ? searchableIndex + 1 : searchableIndex - 1;

    const searchableBoard = entities[searchableIndex];
    const adjacentBoard = entities[adjacentIndex];

    return [searchableBoard, adjacentBoard];
  }

  private resetOrders(entitiesWithoutTarget: TMovable[]): void {
    entitiesWithoutTarget.forEach((entity, index) => {
      entity.order = OrderUtility.calculateOrderByIndex(index);
    });
  }
}
