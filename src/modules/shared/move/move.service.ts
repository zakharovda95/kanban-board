import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import { isNull } from '@/libs/utilities/check.utilities';
import { OrderUtility } from '@/libs/utilities/order.utility';
import {
  IMovable,
  TMoveDirection,
  TMoveOptions,
  TMoveParameters,
} from '@/modules/shared/move/libs/types/move.types';

@Injectable()
export class MoveService<T extends IMovable> {
  public tryToMove(
    entities: T[],
    targetId: number,
    parameters: TMoveParameters,
    options?: TMoveOptions,
  ): void {
    const { previousId, nextId } = parameters;

    const target = entities.find(({ id }) => id === targetId);
    if (!target) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

    // убрали перемещаемый объект, для простоты взаимодействия с order других элементов.
    const withoutTarget = entities.filter(({ id }) => id !== targetId);

    // Если элемент один, и разрешено форс-перемещение и нет указанных ID - сбрасывается order до 1000, становится первым в списке.
    if (!withoutTarget.length) {
      if (options?.allowForceMove && (isNull(previousId) || isNull(nextId))) {
        target.order = OrderUtility.calculateNextOrder(0);
        return;
      } else throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);
    }

    if (previousId) {
      const [previous, next] = this.getAdjacent(withoutTarget, previousId, 'previous');
      if (!previous || previousId === targetId || this.isCurrentPosition(targetId, next?.id)) {
        throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);
      }

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
    if (isNull(previousId)) {
      if (this.isCurrentPosition(targetId, entities[0]?.id))
        throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

      const first = withoutTarget[0];
      if (OrderUtility.needResetOrders(0, first.order)) this.resetOrders(withoutTarget);
      target.order = OrderUtility.calculateIntermediateOrder(0, first.order);
      return;
    }

    if (nextId) {
      const [next, previous] = this.getAdjacent(withoutTarget, nextId, 'next');
      // если позиция не меняется
      if (!next || nextId === targetId || this.isCurrentPosition(targetId, previous?.id))
        throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

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
    if (isNull(nextId)) {
      // если целевой элемент уже стоит последним.
      if (this.isCurrentPosition(targetId, entities[entities.length - 1]?.id))
        throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

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

    const searchable = entities[searchableIndex];
    const adjacent = entities[adjacentIndex];

    return [searchable, adjacent];
  }

  private resetOrders(entitiesWithoutTarget: T[]): void {
    entitiesWithoutTarget.forEach((entity, index) => {
      entity.order = OrderUtility.calculateOrderByIndex(index);
    });
  }

  private isCurrentPosition(targetId: number, entityId: number | null | undefined): boolean {
    return entityId === targetId;
  }
}
