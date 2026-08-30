import type { IMovable, TMoveOptions, TMoveParameters } from '@kanban-board/common';
import { isNull } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import OrderUtility from '@/libs/utilities/order.utility';

@Injectable()
export default class MoveService<T extends IMovable> {
  /**
   * Изменить порядок элемента в списке.
   * Правила перемещения:
   * - Должен быть указан previousId - id элемента после которого будет размещен целевой элемент.
   * - Если previousId - null - элемент помещается в начало.
   * - Если previousId указан числом - элемент помещается сразу после элемента с этим id.
   * - Если существует только один элемент, то он не может быть перемещен (кроме случая allowForceMove).
   * - При allowForceMove и пустом списке (кроме target) допускается перемещение с previousId равным null.
   * - Если позиция элемента не меняется, то он не может быть перемещен.
   * - При нехватке промежутка между order соседних элементов (diff <= 1>) порядок остальных нормализуется.
   * @param entities - список элементов контейнера, отсортированный по order.
   * @param parameters - параметры перемещения (previousId, columnId, targetId).
   * @param options - дополнительные опции (allowForceMove).
   * @returns void. Изменения применяются к переданным entities.
   * **/
  public tryToMove(entities: T[], parameters: TMoveParameters, options?: TMoveOptions): void {
    const { previousId, targetId } = parameters;
    if (!targetId) throw new WsException(EXCEPTION_MESSAGES.idNotFound);

    const target = entities.find(({ id }) => id === targetId);
    if (!target) throw new WsException(EXCEPTION_MESSAGES.notFound);

    // Убрали перемещаемый объект, для простоты взаимодействия с order других элементов.
    const withoutTarget = entities.filter(({ id }) => id !== targetId);

    if (!withoutTarget.length) {
      // allowForceMove Разрешает перемещать, если нет других элементов (например задачу в пустую колонку).
      if (options?.allowForceMove && isNull(previousId)) {
        target.order = OrderUtility.calculateNextOrder(0);
        return;
      } else throw new WsException(EXCEPTION_MESSAGES.moveFailed);
    }

    if (previousId) {
      const [previousElement, adjacentElement] = this.getAdjacent(withoutTarget, previousId);
      if (!previousElement || this.isCurrentPosition(targetId, previousId))
        throw new WsException(EXCEPTION_MESSAGES.moveFailed);

      // Проверяем не находится ли перемещаемая задача на той же позиции.
      const previousIndex = entities.findIndex(({ id }) => id === previousId);
      const targetIndex = entities.findIndex(({ id }) => id === targetId);

      // C allowForceMove позиция может совпадать (например задачу перемещают из одного столбца в другой на ту же позицию)
      if (!options?.allowForceMove && this.isCurrentPosition(targetIndex, previousIndex + 1))
        throw new WsException(EXCEPTION_MESSAGES.moveFailed);

      // если нет adjacentElement, значит помещается в конец (к order последнего элемента в списке прибавляем 1000).
      if (!adjacentElement) {
        target.order = OrderUtility.calculateNextOrder(previousElement.order);
        return;
      }

      // Если между previous и next значение order <= 1 - нормализуем порядок.
      if (OrderUtility.needResetOrders(previousElement.order, adjacentElement.order))
        this.resetOrders(withoutTarget);
      target.order = OrderUtility.calculateIntermediateOrder(
        previousElement.order,
        adjacentElement.order,
      );
      return;
    }

    // если previousId - null - помещаем в начало.
    if (isNull(previousId)) {
      if (this.isCurrentPosition(targetId, entities[0]?.id))
        throw new WsException(EXCEPTION_MESSAGES.moveFailed);

      const first = withoutTarget[0];
      if (OrderUtility.needResetOrders(0, first.order)) this.resetOrders(withoutTarget);
      target.order = OrderUtility.calculateIntermediateOrder(0, first.order);
      return;
    }
  }

  /**
   * Нормализовать порядок элементов (кроме перемещаемого).
   * @param entitiesWithoutTarget - список элементов без перемещаемого.
   * @returns - void. Значения order пересчитываются in-place.
   * **/
  public resetOrders(entitiesWithoutTarget: T[]): void {
    entitiesWithoutTarget.forEach((entity, index) => {
      entity.order = OrderUtility.calculateOrderByIndex(index);
    });
  }

  /**
   * Найти элемент по id и его соседа.
   * @param entities - список элементов.
   * @param previousId - id искомого элемента (который будет перед целевым).
   * @returns кортеж [элемент перед целевым, элемент следующий за ним].
   * **/
  private getAdjacent(entities: T[], previousId: number): [T | undefined, T | undefined] {
    const previousElementIndex = entities.findIndex(({ id }) => id === previousId);
    if (previousElementIndex < 0) return [undefined, undefined];

    const adjacentElementIndex = previousElementIndex + 1;

    // между ними будет целевой элемент
    const previousElement = entities[previousElementIndex];
    const adjacentElement = entities[adjacentElementIndex];

    return [previousElement, adjacentElement];
  }

  /**
   * Проверить, совпадает ли id/index с id/index перемещаемого элемента.
   * @param target - порядковое значение перемещаемого элемента.
   * @param entity - порядковое значение для сравнения.
   * @returns true, если позиция не изменится.
   * **/
  private isCurrentPosition(target: number, entity: number): boolean {
    return target === entity;
  }
}
