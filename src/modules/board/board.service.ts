import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { DataSource } from 'typeorm';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import type { TSuccessResponse } from '@/libs/types/response.types';
import { isDefined } from '@/libs/utils/check.utils';
import { getSuccessResponse, getSuccessResponseWithData } from '@/libs/utils/response.utils';
import { BoardMapper } from '@/modules/board/board.mapper';
import { BoardEntity } from '@/modules/board/libs/entities/board.entity';
import type {
  TBoard,
  TBoardBase,
  TCreateBoard,
  TCreateBoardResponse,
  TPatchBoard,
} from '@/modules/board/libs/types/board.types';
import { DEFAULT_COLUMNS } from '@/modules/column/libs/constants/column.constants';
import { ORDER_STEP } from '@/modules/libs/constants/move.constants';
import { TMoveParameters } from '@/modules/libs/types/move.types';
import { MoveUtility } from '@/modules/libs/utilities/move.utility';

@Injectable()
export class BoardService {
  constructor(
    private dataSource: DataSource,
    private boardMapper: BoardMapper,
  ) {}

  public async getBoards(): Promise<TBoardBase[]> {
    const { manager } = this.dataSource;

    const boards = await manager.find(BoardEntity, { order: { order: 'ASC' } });

    if (!boards.length) return [];
    return this.boardMapper.toModel(boards);
  }

  public async getBoardById(boardId: number): Promise<TBoard> {
    if (!boardId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);

    const { manager } = this.dataSource;

    const board = await manager.findOne(BoardEntity, {
      where: { id: boardId },
      relations: { columns: { issues: true } },
    });
    if (!board) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

    return this.boardMapper.toModel(board, { withRelations: true });
  }

  public async createBoard(body: TCreateBoard): Promise<TCreateBoardResponse> {
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const boardsCount = await manager.count(BoardEntity);

    const { id } = await manager.save(BoardEntity, {
      title: body.title,
      description: body.description ?? null,
      order: MoveUtility.calculateOrderByIndex(boardsCount),
      columns: cloneDeep(DEFAULT_COLUMNS),
    });
    if (!id) throw new InternalServerErrorException(EXCEPTION_MESSAGES.createFailed);

    return getSuccessResponseWithData({ id });
  }

  public async patchBoard(boardId: number, body: TPatchBoard): Promise<TSuccessResponse> {
    if (!boardId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const board = await manager.findOne(BoardEntity, { where: { id: boardId } });
    if (!board) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

    await manager.save(Object.assign(board, body));

    return getSuccessResponse();
  }

  public async moveBoard(boardId: number, body: TMoveParameters): Promise<TSuccessResponse> {
    if (!boardId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    return await manager.transaction(async transactionalManager => {
      const boards = await transactionalManager.find(BoardEntity, {
        order: { order: 'ASC' },
      });

      const targetBoard = boards.find(({ id }) => id === boardId);
      if (!targetBoard) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

      // убираем перемещаемую доску элемент, чтобы не учитывать его при нормализации order и поиске соседей.
      const boardsWithoutTarget = boards.filter(({ id }) => id !== boardId);
      if (!boardsWithoutTarget.length) throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

      /** Получить соседние доски, между которыми будет помещена перемещаемая доска. **/
      const getAdjacentBoards = (
        searchableId: number,
        direction: 'previous' | 'next',
      ): [BoardEntity | undefined, BoardEntity | undefined] => {
        const searchableBoardIndex = boardsWithoutTarget.findIndex(({ id }) => id === searchableId);

        const adjacentBoardIndex =
          direction === 'previous' ? searchableBoardIndex + 1 : searchableBoardIndex - 1;

        const searchableBoard = boardsWithoutTarget[searchableBoardIndex];
        const adjacentBoard = boardsWithoutTarget[adjacentBoardIndex];

        return [searchableBoard, adjacentBoard];
      };

      /** Установить стандартные значения order для всех досок, кроме перемещаемой.  **/
      const resetOrders = (): void => {
        boardsWithoutTarget.forEach((entity, index) => {
          entity.order = MoveUtility.calculateOrderByIndex(index);
        });
      };

      /** Присвоить вычисленное значение order для перемещаемой доски и сохранить изменения.  **/
      const setTargetOrderAndSave = async (order: number): Promise<void> => {
        targetBoard.order = order;
        await transactionalManager.save(BoardEntity, boards);
      };

      const { previousId, nextId } = body;

      // Если передан previousId.
      if (isDefined(previousId)) {
        if (previousId) {
          const [previousBoard, nextBoard] = getAdjacentBoards(previousId, 'previous');
          if (!previousBoard) throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

          // если нет next, значит перемещаемая доска помещается в конец (к order последнего элемента в списке прибавляем 1000).
          if (!nextBoard) {
            await setTargetOrderAndSave(previousBoard.order + ORDER_STEP);
            return getSuccessResponse();
          }

          // Если между previous и next значение order <= 1 - нормализуем порядок всех досок кроме перемещаемой.
          if (MoveUtility.needResetOrders(previousBoard.order, nextBoard.order)) {
            resetOrders();
          }

          await setTargetOrderAndSave(
            MoveUtility.calculateIntermediateOrder(previousBoard.order, nextBoard.order),
          );

          return getSuccessResponse();
        }

        // previousBoardId === null - помещаем перемещаемую доску первой.
        const firstBoard = boardsWithoutTarget[0];
        if (MoveUtility.needResetOrders(0, firstBoard.order)) {
          resetOrders();
        }

        await setTargetOrderAndSave(MoveUtility.calculateIntermediateOrder(0, firstBoard.order));
        return getSuccessResponse();
      }

      // Если передан nextId.
      if (isDefined(nextId)) {
        if (nextId) {
          const [nextBoard, previousBoard] = getAdjacentBoards(nextId, 'next');
          if (!nextBoard) throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

          // если нет previous, значит перемещаемая доска помещается в начало.
          if (!previousBoard) {
            await setTargetOrderAndSave(MoveUtility.calculateIntermediateOrder(0, nextBoard.order));

            return getSuccessResponse();
          }

          // Если между previous и next значение order <= 1 - нормализуем порядок всех досок кроме перемещаемой.
          if (MoveUtility.needResetOrders(previousBoard.order, nextBoard.order)) {
            resetOrders();
          }

          await setTargetOrderAndSave(
            MoveUtility.calculateIntermediateOrder(previousBoard.order, nextBoard.order),
          );
          return getSuccessResponse();
        }

        // если nextBoardId == null - помещаем перемещаемую доску последней.
        const lastBoard = boardsWithoutTarget[boardsWithoutTarget.length - 1];
        await setTargetOrderAndSave(lastBoard.order + ORDER_STEP);
        return getSuccessResponse();
      }

      throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);
    });
  }

  public async deleteBoard(boardId: number): Promise<TSuccessResponse> {
    if (!boardId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);

    const { manager } = this.dataSource;

    const { affected } = await manager.delete(BoardEntity, { id: boardId });
    if (!affected || affected <= 0)
      throw new InternalServerErrorException(EXCEPTION_MESSAGES.deleteFailed);

    return getSuccessResponse();
  }
}
