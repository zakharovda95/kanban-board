import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { sleep } from '@/libs/utils/sleep.utils';
import { BoardsService } from '@/modules/boards/boards.service';
import type { TUpdateBoard } from '@/modules/boards/boards.types';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  /** Получить список досок (для меню выбора доски, только id, название и описание). **/
  @Get()
  public async getBoards(): Promise<string> {
    await sleep();
    return 'Get all boards!';
  }

  /** Создать новую доску (пока нет юзеров - нельзя создавать). **/
  @Post()
  public async createBoard(): Promise<string> {
    await sleep();
    return `New board was created!`;
  }

  /** Получить конкретную доску (после клика на выбор доски, или первую в списке, пока что просто единственная доска). **/
  @Get(':boardId')
  public async getBoardById(@Param('boardId') boardId: number): Promise<string> {
    await sleep();
    return `Get board with id ${boardId}!`;
  }

  /** Архивировать доску и все карточки. **/
  @Post(':boardId/archive')
  public async archiveBoardById(@Param('boardId') boardId: number): Promise<string> {
    await sleep();
    return `Board with id ${boardId} was archived!`;
  }

  /** Восстановить доску и все карточки до состояния на момент архивации. **/
  @Post(':boardId/restore')
  public async restoreBoardById(@Param('boardId') boardId: number): Promise<string> {
    await sleep();
    return `Board with id ${boardId} was archived!`;
  }

  /** Задать название, описание, установить лимит колонок. **/
  @Patch(':boardId')
  public async updateBoardById(
    @Param('boardId') boardId: number,
    @Body() body: TUpdateBoard,
  ): Promise<string> {
    await sleep();
    return `Board with id ${boardId} was updated with data ${JSON.stringify(body)}!`;
  }

  /** Очистить доску (удалить все карточки). **/
  @Delete(':boardId/issues')
  public async clearBoardById(@Param('boardId') boardId: number): Promise<string> {
    await sleep();
    return `Board with id ${boardId} was cleared!`;
  }

  /** Удалить безвозвратно (на данный момент, позже сделать софтовое удаление) доску (включая все карточки). **/
  @Delete(':boardId')
  public async deleteBoardById(@Param('boardId') boardId: number): Promise<string> {
    await sleep();
    return `Board with id ${boardId} was deleted!`;
  }
}
