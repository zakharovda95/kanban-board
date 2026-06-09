import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

import { AtLeastOneFieldRequiredPipe } from '@/libs/pipes/at-least-one-field-required.pipe';
import type { TSuccessResponse } from '@/libs/types/response.types';
import { BoardsService } from '@/modules/boards/boards.service';
import { PatchBoardDto } from '@/modules/boards/libs/dtos/patch-board.dto';
import type { TBoard, TCreateBoardResponse } from '@/modules/boards/libs/types/boards.types';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  public async getBoards(): Promise<TBoard[]> {
    return await this.boardsService.getBoards();
  }

  @Post()
  public async createBoard(): Promise<TCreateBoardResponse> {
    return await this.boardsService.createBoard();
  }

  @Get(':boardId')
  public async getBoardById(@Param('boardId', ParseIntPipe) boardId: number): Promise<TBoard> {
    return await this.boardsService.getBoardById(boardId);
  }

  @Patch(':boardId')
  public async patchBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body(new AtLeastOneFieldRequiredPipe(['title', 'description'])) body: PatchBoardDto,
  ): Promise<TSuccessResponse> {
    return await this.boardsService.patchBoard(boardId, body);
  }
}
