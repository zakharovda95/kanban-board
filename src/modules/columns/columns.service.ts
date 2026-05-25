import { Injectable } from '@nestjs/common';

import { sleep } from '@/libs/utils/sleep.utils';
import type { TUpdateColumn } from '@/modules/columns/libs/columns.types';

@Injectable()
export class ColumnsService {
  public async getColumns(): Promise<string> {
    await sleep();
    return 'Get All Columns!';
  }

  public async createColumn(): Promise<string> {
    await sleep();
    return `New column was created!`;
  }

  public async getColumnById(columnId: number): Promise<string> {
    await sleep();
    return `Get column with id ${columnId}!`;
  }

  public async archiveColumnById(columnId: number): Promise<string> {
    await sleep();
    return `All issues on column with id ${columnId} was archived!`;
  }

  public async updateColumnById(columnId: number, body: TUpdateColumn): Promise<string> {
    await sleep();
    return `Column with id ${columnId} was updated with data ${JSON.stringify(body)}!`;
  }

  public async clearColumnById(columnId: number): Promise<string> {
    await sleep();
    return `Column with id ${columnId} was cleared!`;
  }

  public async deleteColumnById(columnId: number): Promise<string> {
    await sleep();
    return `Column with id ${columnId} was deleted!`;
  }
}
