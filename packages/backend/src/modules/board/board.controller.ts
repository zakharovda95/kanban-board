import {
  positiveIdSchema,
  type TBoard,
  type TBoardBase,
  type TPositiveIdSchema,
} from '@kanban-board/common';
import { Controller, Get, Param } from '@nestjs/common';

import BoardService from '@/modules/board/board.service';

@Controller('boards')
export default class BoardController {
  constructor(private boardService: BoardService) {}

  @Get()
  public async getBoards(): Promise<TBoardBase[]> {
    return await this.boardService.getBoards();
  }

  @Get(':boardId')
  public async getBoardById(
    @Param('boardId', { schema: positiveIdSchema }) boardId: TPositiveIdSchema,
  ): Promise<TBoard> {
    return await this.boardService.getBoardById(boardId);
  }
}
