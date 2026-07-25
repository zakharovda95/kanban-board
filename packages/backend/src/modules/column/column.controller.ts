import type { TCreateColumnResponse, TSuccessResponse } from '@kanban-board/common';
import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import GuidPipe from '@/libs/pipes/guid.pipe';
import { RequireAnyPipe } from '@/libs/pipes/require-any.pipe';
import { ColumnService } from '@/modules/column/column.service';
import { CreateColumnDto } from '@/modules/column/libs/dtos/create-column.dto';
import { PatchColumnDto } from '@/modules/column/libs/dtos/patch-column.dto';
import { MoveParametersDto } from '@/modules/shared/move/libs/dto/move-parameters.dto';
import { MovePipe } from '@/modules/shared/move/libs/pipes/move.pipe';

@Controller()
export class ColumnController {
  constructor(private columnService: ColumnService) {}

  @Post('boards/:boardId/columns')
  public async createColumn(
    @Param('boardId', GuidPipe) boardId: string,
    @Body() body: CreateColumnDto,
  ): Promise<TCreateColumnResponse> {
    return await this.columnService.createColumn(boardId, body);
  }

  @Post('boards/:boardId/columns/:columnId/move')
  @HttpCode(HttpStatus.OK)
  public async moveColumn(
    @Param('boardId', GuidPipe) boardId: string,
    @Param('columnId', GuidPipe) columnId: string,
    @Body(MovePipe) body: MoveParametersDto,
  ): Promise<TSuccessResponse> {
    return await this.columnService.moveColumn(boardId, columnId, body);
  }

  @Patch('boards/:boardId/columns/:columnId')
  public async patchColumn(
    @Param('boardId', GuidPipe) boardId: string,
    @Param('columnId', GuidPipe) columnId: string,
    @Body(new RequireAnyPipe(['title', 'description', 'color'])) body: PatchColumnDto,
  ): Promise<TSuccessResponse> {
    return this.columnService.patchColumn(boardId, columnId, body);
  }

  @Delete('boards/:boardId/columns/:columnId')
  public async deleteColumn(
    @Param('boardId', GuidPipe) boardId: string,
    @Param('columnId', GuidPipe) columnId: string,
  ): Promise<TSuccessResponse> {
    return this.columnService.deleteColumn(boardId, columnId);
  }
}
