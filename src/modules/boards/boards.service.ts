import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { DEFAULT_TITLE } from '@/libs/constants/shared.constants';
import { TSuccessResponse } from '@/libs/types/response.types';
import { ResponseUtils } from '@/libs/utils/response.utils';
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
      order: boardsCount < 0 ? 0 : boardsCount,
      columns: [...DEFAULT_COLUMNS],
    });
    if (!boardId)
      throw new InternalServerErrorException(BOARDS_EXCEPTION_MESSAGES.errorCreatingBoard);

    return ResponseUtils.getSuccessResponseWithData({ boardId });
  }

  public async patchBoard(boardId: number, body: TPatchBoard): Promise<TSuccessResponse> {
    const { manager } = this.dataSource;

    const boardEntity = await manager.findOne(BoardEntity, { where: { boardId } });
    if (!boardEntity) throw new NotFoundException(BOARDS_EXCEPTION_MESSAGES.boardNotFound);

    await manager.save(Object.assign(boardEntity, body));

    return ResponseUtils.getSuccessResponse();
  }

  public async moveBoard(boardId: number, body: TMoveBoard): Promise<TSuccessResponse> {
    const { manager } = this.dataSource;

    await manager.transaction(async transactionalManager => {
      const boardsCount = await transactionalManager.count(BoardEntity);
      if (boardsCount <= 1) {
        throw new BadRequestException(BOARDS_EXCEPTION_MESSAGES.boardCanNotBeMoved);
      }

      console.log(boardId, body);
    });

    return ResponseUtils.getSuccessResponse();
  }

  public async deleteBoard(boardId: number): Promise<TSuccessResponse> {
    const { manager } = this.dataSource;

    const { affected } = await manager.delete(BoardEntity, { boardId });
    if (!affected || affected <= 0)
      throw new InternalServerErrorException(BOARDS_EXCEPTION_MESSAGES.errorDeletingBoard);

    return ResponseUtils.getSuccessResponse();
  }
}
