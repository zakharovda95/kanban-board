import { Controller, Get, Param, Post } from '@nestjs/common';

import { sleep } from '@/libs/utils/sleep.utils';
import { ColumnsService } from '@/modules/columns/columns.service';

@Controller('columns')
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  /** Метод не нужен тк колонки и задачи приходят вместе с доской (реализован как системный метод). **/
  @Get()
  public async getColumns(): Promise<string> {
    await sleep();
    return 'Get All Columns!';
  }

  /** Добавить новую колонку на доску. **/
  @Post()
  public async createColumn(): Promise<string> {
    await sleep();
    return `New column was created!`;
  }

  /** Метод не нужен тк колонки и задачи приходят вместе с доской (реализован как системный метод). **/
  @Get(':id')
  public async getColumnById(@Param('id') columnId: number): Promise<string> {
    await sleep();
    return `Get column with id ${columnId}!`;
  }
}
