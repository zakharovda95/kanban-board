import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { sleep } from '@/libs/utils/sleep.utils';
import { NewBoardDto } from '@/modules/boards/dtos/new-board.dto';

@Controller('boards')
export class BoardsController {
  /** Получить список досок (для меню выбора доски, только id, название и описание) **/
  @Get()
  public async getBoards(): Promise<string> {
    await sleep();
    return 'Get all boards!';
  }

  /** Создать новую доску (пока нет юзеров, просто добавляется новая доска в базу) **/
  @Post()
  public async createBoard(@Body() body: NewBoardDto): Promise<string> {
    await sleep();
    return `New board was created! ${JSON.stringify(body)}`;
  }

  /** Получить конкретную доску (после клика на выбор доски, или первую в списке) **/
  @Get(':id')
  public async getBoardById(@Param('id') boardId: number): Promise<string> {
    await sleep();
    return `Get board with id ${boardId}!`;
  }
}
