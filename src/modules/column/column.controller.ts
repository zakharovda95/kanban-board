import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import type { TSuccessResponse } from '@/libs/types/response.types';
import { ColumnService } from '@/modules/column/column.service';
import { CreateColumnDto } from '@/modules/column/libs/dtos/create-column.dto';
import { MoveColumnDto } from '@/modules/column/libs/dtos/move-column.dto';
import { PatchColumnDto } from '@/modules/column/libs/dtos/patch-column.dto';
import type { TCreateColumnResponse } from '@/modules/column/libs/types/column.types';

@Controller()
export class ColumnController {
  constructor(private columnService: ColumnService) {}

  @Post('boards/:boardId/columns')
  public async createColumn(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() body: CreateColumnDto,
  ): Promise<TCreateColumnResponse> {
    return await this.columnService.createColumn(boardId, body);
  }

  @Post('columns/:columnId/move')
  @HttpCode(HttpStatus.OK)
  public async moveColumn(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() body: MoveColumnDto,
  ): Promise<TSuccessResponse> {
    return await this.columnService.moveColumn(columnId, body);
  }

  @Patch('columns/:columnId')
  public async patchColumn(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() body: PatchColumnDto,
  ): Promise<TSuccessResponse> {
    return this.columnService.patchColumn(columnId, body);
  }

  @Delete('columns/:columnId')
  public async deleteColumn(
    @Param('columnId', ParseIntPipe) columnId: number,
  ): Promise<TSuccessResponse> {
    return this.columnService.deleteColumn(columnId);
  }
}
