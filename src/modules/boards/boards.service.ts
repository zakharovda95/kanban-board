import { Injectable } from '@nestjs/common';

import { sleep } from '@/libs/utils/sleep.utils';
import type { TUpdateBoard } from '@/modules/boards/libs/boards.types';

@Injectable()
export class BoardsService {
  /** Получить список досок (для меню выбора доски, только id и название). **/
  public async getBoards(): Promise<string> {
    await sleep();
    return 'Get all boards!';
  }

  /** Создать новую доску. **/
  public async createBoard(): Promise<string> {
    await sleep();
    return `New board was created!`;
  }

  /** Получить выбранную (активную) доску. **/
  public async getBoardById(boardId: number): Promise<string> {
    await sleep();
    return `Get board with id ${boardId}!`;
  }

  /** Архивировать доску и все карточки. **/
  public async archiveBoardById(boardId: number): Promise<string> {
    await sleep();
    return `Board with id ${boardId} was archived!`;
  }

  /** Восстановить доску и все карточки до состояния на момент архивации. **/
  public async restoreBoardById(boardId: number): Promise<string> {
    await sleep();
    return `Board with id ${boardId} was restored!`;
  }

  /** Задать название, описание, установить лимит колонок. **/
  public async updateBoardById(boardId: number, body: TUpdateBoard): Promise<string> {
    await sleep();
    return `Board with id ${boardId} was updated with data ${JSON.stringify(body)}!`;
  }

  /** Очистить доску (soft-удаление всех карточек). **/
  public async clearBoardById(boardId: number): Promise<string> {
    await sleep();
    return `Board with id ${boardId} was cleared!`;
  }

  /** Удалить (soft-удаление) доску и все карточки. **/
  public async deleteBoardById(boardId: number): Promise<string> {
    await sleep();
    return `Board with id ${boardId} was deleted!`;
  }
}
