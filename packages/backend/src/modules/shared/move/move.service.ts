import { isNull } from '@kanban-board/common';
import { IMovable, TMoveDirection, TMoveOptions, TMoveParameters } from '@kanban-board/common';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import { OrderUtility } from '@/libs/utilities/order.utility';

@Injectable()
export class MoveService<T extends IMovable> {
  /**
   * Изменить порядок элемента в списке.
   * Правила перемещения:
   * - Должен быть указан только previousId или nextId, но не оба сразу.
   * - Если previousId - null - элемент помещается в начало.
   * - Если nextId - null - элемент помещается в конец.
   * - Если previousId указан числом - элемент помещается сразу после элемента с этим id.
   * - Если nextId указан числом - элемент помещается сразу перед элементом с этим id.
   * - Если существует только один элемент, то он не может быть перемещен (кроме случая allowForceMove).
   * - При allowForceMove и пустом списке (кроме target) допускается перемещение с previousId или nextId равным null.
   * - Если позиция элемента не меняется, то он не может быть перемещен.
   * - При нехватке промежутка между order соседних элементов порядок остальных нормализуется.
   * @param entities - список элементов контейнера, отсортированный по order.
   * @param targetId - id перемещаемого элемента.
   * @param parameters - параметры перемещения (previousId / nextId).
   * @param options - дополнительные опции (allowForceMove).
   * @returns void. Изменения применяются к переданным entities.
   * **/
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
      if (!previous || this.isCurrentPosition(targetId, previousId))
        throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

      // Проверяем не находится ли перемещаемая задача на той же позиции.
      const previousIndex = entities.findIndex(({ id }) => id === previousId);
      const targetIndex = entities.findIndex(({ id }) => id === targetId);

      if (!options?.allowForceMove && this.isCurrentPosition(targetIndex, previousIndex + 1))
        throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

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
      const [next, previous] = this.getAdjacent(entities, nextId, 'next');
      // если позиция не меняется
      if (!next || this.isCurrentPosition(targetId, nextId))
        throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

      // если нет previous, значит перемещаемая помещается в начало.
      if (!previous) {
        target.order = OrderUtility.calculateIntermediateOrder(0, next.order);
        return;
      }

      if (this.isCurrentPosition(targetId, previous.id))
        throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

      if (OrderUtility.needResetOrders(previous.order, next.order)) this.resetOrders(withoutTarget);
      target.order = OrderUtility.calculateIntermediateOrder(previous.order, next.order);
      return;
    }

    // если nextId == null - помещаем в конец.
    if (isNull(nextId)) {
      if (
        !options?.allowForceMove &&
        this.isCurrentPosition(targetId, entities[entities.length - 1].id)
      ) {
        throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);
      }

      const last = withoutTarget[withoutTarget.length - 1];
      target.order = OrderUtility.calculateNextOrder(last.order);
      return;
    }
  }

  /**
   * Найти элемент по id и его соседа в указанном направлении.
   * @param entities - список элементов.
   * @param searchableId - id искомого элемента.
   * @param direction - направление поиска соседа (previous — следующий в списке, next — предыдущий).
   * @returns кортеж [искомый элемент, соседний элемент].
   * **/
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

  /**
   * Нормализовать порядок элементов (кроме перемещаемого).
   * @param entitiesWithoutTarget - список элементов без перемещаемого.
   * @returns - void. Значения order пересчитываются in-place.
   * **/
  private resetOrders(entitiesWithoutTarget: T[]): void {
    entitiesWithoutTarget.forEach((entity, index) => {
      entity.order = OrderUtility.calculateOrderByIndex(index);
    });
  }

  /**
   * Проверить, совпадает ли id с id перемещаемого элемента.
   * @param target - порядковое значение перемещаемого элемента.
   * @param entity - порядковое значение для сравнения.
   * @returns true, если позиция не изменится.
   * **/
  private isCurrentPosition(target: number, entity: number): boolean {
    return target === entity;
  }
}
