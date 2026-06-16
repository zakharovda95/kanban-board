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
import { ColumnsService } from '@/modules/columns/columns.service';
import { CreateColumnDto } from '@/modules/columns/libs/dtos/create-column.dto';
import { MoveColumnDto } from '@/modules/columns/libs/dtos/move-column.dto';
import { PatchColumnDto } from '@/modules/columns/libs/dtos/patch-column.dto';
import type { TCreateColumnResponse } from '@/modules/columns/libs/types/columns.types';

@Controller('columns')
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  @Post()
  public async createColumn(@Body() body: CreateColumnDto): Promise<TCreateColumnResponse> {
    return await this.columnsService.createColumn(body);
  }

  @Post(':columnId/move')
  @HttpCode(HttpStatus.OK)
  public async moveColumn(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() body: MoveColumnDto,
  ): Promise<TSuccessResponse> {
    return await this.columnsService.moveColumn(columnId, body);
  }

  @Patch(':columnId')
  public async patchColumn(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() body: PatchColumnDto,
  ): Promise<TSuccessResponse> {
    return this.columnsService.patchColumn(columnId, body);
  }

  @Delete(':columnId')
  public async deleteColumn(
    @Param('columnId', ParseIntPipe) columnId: number,
  ): Promise<TSuccessResponse> {
    return this.columnsService.deleteColumn(columnId);
  }
}
