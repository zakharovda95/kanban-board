import { Injectable } from '@nestjs/common';

import { sleep } from '@/libs/utils/sleep.utils';
import type { TPatchBoard } from '@/modules/boards/libs/boards.types';

@Injectable()
export class BoardsService {
  public async getBoardById(boardId: number): Promise<string> {
    await sleep();
    return `Get board with id ${boardId}!`;
  }

  public async patchBoardById(boardId: number, body: TPatchBoard): Promise<string> {
    await sleep();
    return `Board with id ${boardId} was updated with data ${JSON.stringify(body)}!`;
  }
}
