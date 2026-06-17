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

      const [targetBoard, boardsWithoutTarget] = MoveUtility.separateTarget<BoardEntity>(
        boards,
        boardId,
      );
      if (!targetBoard) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);
      if (!boardsWithoutTarget.length) throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

      const { previousId, nextId } = body;

      if (isDefined(previousId) && previousId) {
        const [previousBoard, nextBoard] = MoveUtility.getAdjacent<BoardEntity>(
          boardsWithoutTarget,
          previousId,
          'previous',
        );
        if (!previousBoard) throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

        // если нет next, значит перемещаемая доска помещается в конец (к order последнего элемента в списке прибавляем 1000).
        if (!nextBoard) {
          targetBoard.order = previousBoard.order + ORDER_STEP;
          await transactionalManager.save(BoardEntity, boards);
          return getSuccessResponse();
        }

        // Если между previous и next значение order <= 1 - нормализуем порядок всех досок кроме перемещаемой.
        if (MoveUtility.needResetOrders(previousBoard.order, nextBoard.order)) {
          MoveUtility.resetOrders<BoardEntity>(boardsWithoutTarget);
        }

        targetBoard.order = MoveUtility.calculateIntermediateOrder(
          previousBoard.order,
          nextBoard.order,
        );
        await transactionalManager.save(BoardEntity, boards);
        return getSuccessResponse();
      }

      // если previousId === null
      if (isDefined(previousId) && !previousId) {
        // previousId === null - помещаем перемещаемую доску первой.
        const firstBoard = boardsWithoutTarget[0];

        if (MoveUtility.needResetOrders(0, firstBoard.order)) {
          MoveUtility.resetOrders<BoardEntity>(boardsWithoutTarget);
        }

        targetBoard.order = MoveUtility.calculateIntermediateOrder(0, firstBoard.order);
        await transactionalManager.save(BoardEntity, boards);
        return getSuccessResponse();
      }

      if (isDefined(nextId) && nextId) {
        const [nextBoard, previousBoard] = MoveUtility.getAdjacent<BoardEntity>(
          boardsWithoutTarget,
          nextId,
          'next',
        );
        if (!nextBoard) throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

        // если нет previous, значит перемещаемая доска помещается в начало.
        if (!previousBoard) {
          targetBoard.order = MoveUtility.calculateIntermediateOrder(0, nextBoard.order);
          await transactionalManager.save(BoardEntity, boards);
          return getSuccessResponse();
        }

        // Если между previous и next значение order <= 1 - нормализуем порядок всех досок кроме перемещаемой.
        if (MoveUtility.needResetOrders(previousBoard.order, nextBoard.order)) {
          MoveUtility.resetOrders<BoardEntity>(boardsWithoutTarget);
        }

        targetBoard.order = MoveUtility.calculateIntermediateOrder(
          previousBoard.order,
          nextBoard.order,
        );
        await transactionalManager.save(BoardEntity, boards);
        return getSuccessResponse();
      }

      if (isDefined(nextId) && !nextId) {
        // если nextBoardId == null - помещаем перемещаемую доску последней.
        const lastBoard = boardsWithoutTarget[boardsWithoutTarget.length - 1];
        targetBoard.order = lastBoard.order + ORDER_STEP;
        await transactionalManager.save(BoardEntity, boards);
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
