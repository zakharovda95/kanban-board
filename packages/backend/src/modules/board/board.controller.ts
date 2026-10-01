import type { TBoard, TBoardBase } from '@kanban-board/common';
import { Controller, Get, Param } from '@nestjs/common';

import ParameterNumberPipe from '@/libs/pipes/parameter-number.pipe';
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
    @Param('boardId', new ParameterNumberPipe('http', { zero: false, negative: false }))
    boardId: number,
  ): Promise<TBoard> {
    return await this.boardService.getBoardById(boardId);
  }
}
