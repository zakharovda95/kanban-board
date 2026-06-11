import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ORDER_STEP } from '@/libs/constants/order.constants';
import { DEFAULT_TITLE } from '@/libs/constants/shared.constants';
import { TSuccessResponse } from '@/libs/types/response.types';
import { calculateIntermediateOrder, needResetOrders } from '@/libs/utils/order.utils';
import { getSuccessResponse, getSuccessResponseWithData } from '@/libs/utils/response.utils';
import { BoardsMapper } from '@/modules/boards/boards.mapper';
import { BOARDS_EXCEPTION_MESSAGES } from '@/modules/boards/libs/constants/boards-exception.constants';
import { BoardEntity } from '@/modules/boards/libs/entities/board.entity';
import type {
  TBoard,
  TBoardBase,
  TCreateBoardResponse,
  TMoveBoard,
  TPatchBoard,
} from '@/modules/boards/libs/types/boards.types';
import { DEFAULT_COLUMNS } from '@/modules/columns/libs/constants/columns.constants';

@Injectable()
export class BoardsService {
  constructor(
    private dataSource: DataSource,
    private boardsMapper: BoardsMapper,
  ) {}

  public async getBoards(): Promise<TBoardBase[]> {
    const { manager } = this.dataSource;

    const boardEntities = await manager.find(BoardEntity, { order: { order: 'ASC' } });

    if (!boardEntities.length) return [];
    return this.boardsMapper.toModel(boardEntities);
  }

  public async getBoardById(boardId: number): Promise<TBoard> {
    const { manager } = this.dataSource;

    const boardEntity = await manager.findOne(BoardEntity, {
      where: { boardId },
      relations: { columns: { issues: true } },
    });
    if (!boardEntity) throw new NotFoundException(BOARDS_EXCEPTION_MESSAGES.boardNotFound);

    return this.boardsMapper.toModel(boardEntity, { withRelations: true });
  }

  public async createBoard(): Promise<TCreateBoardResponse> {
    const { manager } = this.dataSource;

    const boardsCount = await manager.count(BoardEntity);

    const { boardId } = await manager.save(BoardEntity, {
      title: DEFAULT_TITLE,
      description: null,
      order: boardsCount === 0 ? 1000 : (boardsCount + 1) * ORDER_STEP,
      columns: [...DEFAULT_COLUMNS],
    });
    if (!boardId)
      throw new InternalServerErrorException(BOARDS_EXCEPTION_MESSAGES.errorCreatingBoard);

    return getSuccessResponseWithData({ boardId });
  }

  public async patchBoard(boardId: number, body: TPatchBoard): Promise<TSuccessResponse> {
    const { manager } = this.dataSource;

    const boardEntity = await manager.findOne(BoardEntity, { where: { boardId } });
    if (!boardEntity) throw new NotFoundException(BOARDS_EXCEPTION_MESSAGES.boardNotFound);

    await manager.save(Object.assign(boardEntity, body));

    return getSuccessResponse();
  }

  public async moveBoard(boardId: number, body: TMoveBoard): Promise<TSuccessResponse> {
    const { manager } = this.dataSource;
    const { previousBoardId } = body;

    await manager.transaction(async transactionalManager => {
      const boardEntities = await transactionalManager.find(BoardEntity, {
        order: { order: 'ASC' },
      });

      const targetBoardEntity = boardEntities.find(entity => entity.boardId === boardId);

      // убираем перемещаемую доску элемент, чтобы не учитывать его при нормализации order и поиске соседей.
      const boardEntitiesWithoutTarget = boardEntities.filter(entity => entity.boardId !== boardId);

      if (previousBoardId) {
        const previousBoardEntityIndex = boardEntitiesWithoutTarget.findIndex(
          ({ boardId }) => boardId === previousBoardId,
        );
        const nextBoardEntityIndex = previousBoardEntityIndex + 1;

        const previousBoardEntity = boardEntitiesWithoutTarget[previousBoardEntityIndex];
        const nextBoardEntity = boardEntitiesWithoutTarget[nextBoardEntityIndex];

        if (!targetBoardEntity || !previousBoardEntity)
          throw new NotFoundException(BOARDS_EXCEPTION_MESSAGES.boardNotFound);

        // если нет next, значит перемещаемая доска помещается в конец (к order последнего элемента в списке прибавляем 1000).
        if (!nextBoardEntity) {
          targetBoardEntity.order = previousBoardEntity.order + ORDER_STEP;
          await transactionalManager.save(BoardEntity, targetBoardEntity);
          return getSuccessResponse();
        }

        // Если между previous и next не осталось места - нормализуем порядок всех досок кроме перемещаемой.
        if (needResetOrders(previousBoardEntity.order, nextBoardEntity.order)) {
          boardEntitiesWithoutTarget.forEach((entity, index) => {
            entity.order = (index + 1) * ORDER_STEP;
          });
        }

        targetBoardEntity.order = calculateIntermediateOrder(
          previousBoardEntity.order,
          nextBoardEntity.order,
        );

        await transactionalManager.save(BoardEntity, boardEntities);
        return getSuccessResponse();
      }
    });

    return getSuccessResponse();
  }

  public async deleteBoard(boardId: number): Promise<TSuccessResponse> {
    const { manager } = this.dataSource;

    const { affected } = await manager.delete(BoardEntity, { boardId });
    if (!affected || affected <= 0)
      throw new InternalServerErrorException(BOARDS_EXCEPTION_MESSAGES.errorDeletingBoard);

    return getSuccessResponse();
  }
}
