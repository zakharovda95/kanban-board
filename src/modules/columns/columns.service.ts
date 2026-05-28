import { Injectable } from '@nestjs/common';

import { sleep } from '@/libs/utils/sleep.utils';
import type { TMoveColumn, TPatchColumn } from '@/modules/columns/libs/types/columns.types';

@Injectable()
export class ColumnsService {
  public async createColumn(): Promise<string> {
    await sleep();
    return `New column was created!`;
  }

  public async moveColumn(columnId: number, body: TMoveColumn): Promise<string> {
    await sleep();
    return `Column with id ${columnId} was moved! with data ${JSON.stringify(body)}`;
  }

  public async patchColumn(columnId: number, body: TPatchColumn): Promise<string> {
    await sleep();
    return `Column with id ${columnId} was updated with data ${JSON.stringify(body)}!`;
  }

  public async deleteColumn(columnId: number): Promise<string> {
    await sleep();
    return `Column with id ${columnId} was deleted!`;
  }
}
