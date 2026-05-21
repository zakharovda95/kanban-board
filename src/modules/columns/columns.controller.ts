import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { sleep } from '@/libs/utils/sleep.utils';
import { NewColumnDto } from '@/modules/columns/dtos/new-column.dto';

@Controller('columns')
export class ColumnsController {
  /** Метод не нужен тк колонки и задачи приходят вместе с доской (реализован как системный метод). **/
  @Get()
  public async getColumns(): Promise<string> {
    await sleep();
    return 'Get All Columns!';
  }

  /** Добавить новую колонку на доску. **/
  @Post()
  public async createColumn(@Body() body: NewColumnDto): Promise<string> {
    await sleep();
    return `New column was created! ${JSON.stringify(body)}`;
  }

  /** Метод не нужен тк колонки и задачи приходят вместе с доской (реализован как системный метод). **/
  @Get(':id')
  public async getColumnById(@Param('id') columnId: number): Promise<string> {
    await sleep();
    return `Get column with id ${columnId}!`;
  }
}
