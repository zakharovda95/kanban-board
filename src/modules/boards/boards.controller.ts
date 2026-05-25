import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { BoardsService } from '@/modules/boards/boards.service';
import { UpdateBoardDto } from '@/modules/boards/libs/boards.dtos';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  public async getBoards(): Promise<string> {
    return await this.boardsService.getBoards();
  }

  @Post()
  public async createBoard(): Promise<string> {
    return await this.boardsService.createBoard();
  }

  @Get(':boardId')
  public async getBoardById(@Param('boardId') boardId: number): Promise<string> {
    return await this.boardsService.getBoardById(boardId);
  }

  @Post(':boardId/archive')
  public async archiveBoardById(@Param('boardId') boardId: number): Promise<string> {
    return await this.boardsService.archiveBoardById(boardId);
  }

  @Post(':boardId/restore')
  public async restoreBoardById(@Param('boardId') boardId: number): Promise<string> {
    return await this.boardsService.restoreBoardById(boardId);
  }

  @Patch(':boardId')
  public async updateBoardById(
    @Param('boardId') boardId: number,
    @Body() body: UpdateBoardDto,
  ): Promise<string> {
    return await this.boardsService.updateBoardById(boardId, body);
  }

  @Delete(':boardId/issues')
  public async clearBoardById(@Param('boardId') boardId: number): Promise<string> {
    return await this.boardsService.clearBoardById(boardId);
  }

  @Delete(':boardId')
  public async deleteBoardById(@Param('boardId') boardId: number): Promise<string> {
    return await this.boardsService.deleteBoardById(boardId);
  }
}
