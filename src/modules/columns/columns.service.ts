import { Injectable } from '@nestjs/common';

import { sleep } from '@/libs/utils/sleep.utils';
import type { TPatchColumn } from '@/modules/columns/libs/columns.types';

@Injectable()
export class ColumnsService {
  public async createColumn(): Promise<string> {
    await sleep();
    return `New column was created!`;
  }

  public async patchColumnById(columnId: number, body: TPatchColumn): Promise<string> {
    await sleep();
    return `Column with id ${columnId} was updated with data ${JSON.stringify(body)}!`;
  }

  public async deleteColumnById(columnId: number): Promise<string> {
    await sleep();
    return `Column with id ${columnId} was deleted!`;
  }
}
