import { Body, Controller, Get, Param, Patch } from '@nestjs/common';

import { BoardsService } from '@/modules/boards/boards.service';
import { PatchBoardDto } from '@/modules/boards/libs/boards.dtos';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get(':boardId')
  public async getBoardById(@Param('boardId') boardId: number): Promise<string> {
    return await this.boardsService.getBoardById(boardId);
  }

  @Patch(':boardId')
  public async patchBoard(
    @Param('boardId') boardId: number,
    @Body() body: PatchBoardDto,
  ): Promise<string> {
    return await this.boardsService.patchBoard(boardId, body);
  }
}
