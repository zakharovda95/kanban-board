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

@Controller('columns')
export class ColumnController {
  constructor(private columnService: ColumnService) {}

  @Post()
  public async createColumn(@Body() body: CreateColumnDto): Promise<TCreateColumnResponse> {
    return await this.columnService.createColumn(body);
  }

  @Post(':columnId/move')
  @HttpCode(HttpStatus.OK)
  public async moveColumn(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() body: MoveColumnDto,
  ): Promise<TSuccessResponse> {
    return await this.columnService.moveColumn(columnId, body);
  }

  @Patch(':columnId')
  public async patchColumn(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() body: PatchColumnDto,
  ): Promise<TSuccessResponse> {
    return this.columnService.patchColumn(columnId, body);
  }

  @Delete(':columnId')
  public async deleteColumn(
    @Param('columnId', ParseIntPipe) columnId: number,
  ): Promise<TSuccessResponse> {
    return this.columnService.deleteColumn(columnId);
  }
}
