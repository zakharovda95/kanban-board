import type { TBoardBase } from '@kanban-board/common';
import { Controller, Get, Param } from '@nestjs/common';

import ParameterIdPipe from '@/libs/pipes/parameter-id.pipe';
import ColumnService from '@/modules/column/column.service';

@Controller()
export default class ColumnController {
  constructor(private columnService: ColumnService) {}

  @Get('boards/:boardId/columns')
  public async getBoards(
    @Param('boardId', new ParameterIdPipe('ws')) boardId: number,
  ): Promise<TBoardBase[]> {
    return await this.columnService.getColumns(boardId);
  }
}
