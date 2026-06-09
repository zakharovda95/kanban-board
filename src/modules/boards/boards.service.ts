import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { DEFAULT_TITLE } from '@/libs/constants/shared.constants';
import { TSuccessResponse } from '@/libs/types/response.types';
import { ResponseUtils } from '@/libs/utils/response.utils';
import { BoardsMapper } from '@/modules/boards/boards.mapper';
import { BOARDS_EXCEPTION_MESSAGE } from '@/modules/boards/libs/constants/boards-exception.constants';
import { BoardEntity } from '@/modules/boards/libs/entities/board.entity';
import type {
  TBoard,
  TCreateBoardResponse,
  TPatchBoard,
} from '@/modules/boards/libs/types/boards.types';
import { DEFAULT_COLUMNS } from '@/modules/columns/libs/constants/columns.constants';

@Injectable()
export class BoardsService {
  constructor(
    private dataSource: DataSource,
    private boardsMapper: BoardsMapper,
  ) {}

  public async getBoards(): Promise<TBoard[]> {
    const boardEntities = await this.dataSource.manager.find(BoardEntity, {
      relations: { columns: { issues: true } },
    });
    if (!boardEntities.length) return [];
    return this.boardsMapper.toModel(boardEntities);
  }

  public async getBoardById(boardId: number): Promise<TBoard> {
    const boardEntity = await this.dataSource.manager.findOne(BoardEntity, {
      where: { boardId },
      relations: { columns: { issues: true } },
    });

    if (!boardEntity) throw new NotFoundException(BOARDS_EXCEPTION_MESSAGE.boardNotFound);
    return this.boardsMapper.toModel(boardEntity);
  }

  public async createBoard(): Promise<TCreateBoardResponse> {
    const { boardId } = await this.dataSource.transaction(async manager => {
      return await manager.save(BoardEntity, {
        title: DEFAULT_TITLE,
        description: null,
        columns: [...DEFAULT_COLUMNS],
      });
    });

    if (!boardId) throw new BadRequestException(BOARDS_EXCEPTION_MESSAGE.errorCreatingNewBoard);
    return ResponseUtils.getSuccessResponseWithData({ boardId });
  }

  public async patchBoard(boardId: number, body: TPatchBoard): Promise<TSuccessResponse> {
    const boardEntity = await this.dataSource.manager.findOne(BoardEntity, { where: { boardId } });
    if (!boardEntity) throw new NotFoundException(BOARDS_EXCEPTION_MESSAGE.boardNotFound);
    await this.dataSource.manager.save(Object.assign(boardEntity, body));
    return ResponseUtils.getSuccessResponse();
  }
}
