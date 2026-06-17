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
import { OrderUtility } from '@/libs/utilities/order.utility';
import {
  getSuccessResponse,
  getSuccessResponseWithData,
} from '@/libs/utilities/response.utilities';
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
import { TMoveParameters } from '@/modules/shared/move/libs/types/move.types';
import { MoveService } from '@/modules/shared/move/move.service';

@Injectable()
export class BoardService {
  constructor(
    private dataSource: DataSource,
    private boardMapper: BoardMapper,
    private moveService: MoveService<BoardEntity>,
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
      order: OrderUtility.calculateOrderByIndex(boardsCount),
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

      this.moveService.tryToMove(boards, boardId, body);
      await transactionalManager.save(BoardEntity, boards);

      return getSuccessResponse();
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
