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

import { RequireAnyPipe } from '@/libs/pipes/require-any.pipe';
import type { TSuccessResponse } from '@/libs/types/response.types';
import { ColumnService } from '@/modules/column/column.service';
import { CreateColumnDto } from '@/modules/column/libs/dtos/create-column.dto';
import { PatchColumnDto } from '@/modules/column/libs/dtos/patch-column.dto';
import type { TCreateColumnResponse } from '@/modules/column/libs/types/column.types';
import { MoveParametersDto } from '@/modules/shared/move/libs/dto/move-parameters.dto';
import { MovePipe } from '@/modules/shared/move/libs/pipes/move.pipe';

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
    @Body(MovePipe) body: MoveParametersDto,
  ): Promise<TSuccessResponse> {
    return await this.columnService.moveColumn(columnId, body);
  }

  @Patch('columns/:columnId')
  public async patchColumn(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body(new RequireAnyPipe(['title', 'description', 'color'])) body: PatchColumnDto,
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
