import {
  positiveIdSchema,
  type TBoard,
  type TBoardBase,
  type TPositiveIdSchema,
} from '@kanban-board/common';
import { Can } from '@nestjs/authorization';
import { Controller, Get, Param, UsePipes } from '@nestjs/common';

import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';
import BoardService from '@/modules/board/board.service';

@Controller('boards')
@UsePipes(CustomValidationPipe.httpStandardSchemaPipe)
export default class BoardController {
  constructor(private boardService: BoardService) {}

  @Get()
  @Can.Anyone()
  async getBoards(): Promise<TBoardBase[]> {
    return await this.boardService.getBoards();
  }

  @Can.Anyone()
  @Get(':boardId')
  public async getBoardById(
    @Param('boardId', { schema: positiveIdSchema }) boardId: TPositiveIdSchema,
  ): Promise<TBoard> {
    return await this.boardService.getBoardById(boardId);
  }
}
