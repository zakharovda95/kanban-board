import type { TSuccessResponse } from '@kanban-board/common';
import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';

import ParameterIdPipe from '@/libs/pipes/parameter-id.pipe';
import { ColumnService } from '@/modules/column/column.service';
import { MoveParametersDto } from '@/modules/shared/move/libs/dto/move-parameters.dto';
import { MovePipe } from '@/modules/shared/move/libs/pipes/move.pipe';

@Controller()
export class ColumnController {
  constructor(private columnService: ColumnService) {}

  @Post('/boards/:boardId/columns/:columnId/move')
  @HttpCode(HttpStatus.OK)
  public async moveColumn(
    @Param('boardId', ParameterIdPipe) boardId: number,
    @Param('columnId', ParameterIdPipe) columnId: number,
    @Body(MovePipe) body: MoveParametersDto,
  ): Promise<TSuccessResponse> {
    return await this.columnService.moveColumn(boardId, columnId, body);
  }
}
