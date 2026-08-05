import type { TBoard, TBoardBase, TSuccessResponse } from '@kanban-board/common';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';

import ParameterIdPipe from '@/libs/pipes/parameter-id.pipe';
import { BoardService } from '@/modules/board/board.service';
import { MoveParametersDto } from '@/modules/shared/move/libs/dto/move-parameters.dto';
import { MovePipe } from '@/modules/shared/move/libs/pipes/move.pipe';

@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get()
  public async getBoards(): Promise<TBoardBase[]> {
    return await this.boardService.getBoards();
  }

  @Get(':boardId')
  public async getBoardById(
    @Param('boardId', new ParameterIdPipe('http')) boardId: number,
  ): Promise<TBoard> {
    return await this.boardService.getBoardById(boardId);
  }

  @Post(':boardId/move')
  @HttpCode(HttpStatus.OK)
  public async moveBoard(
    @Param('boardId', new ParameterIdPipe('http')) boardId: number,
    @Body(MovePipe) body: MoveParametersDto,
  ): Promise<TSuccessResponse> {
    return await this.boardService.moveBoard(boardId, body);
  }
}
