import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

import { ColumnsService } from '@/modules/columns/columns.service';
import { MoveColumnDto, PatchColumnDto } from '@/modules/columns/libs/columns.dtos';

@Controller('columns')
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  @Post()
  public async createColumn(): Promise<string> {
    return await this.columnsService.createColumn();
  }

  @Post(':columnId/move')
  public async moveColumn(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() body: MoveColumnDto,
  ): Promise<string> {
    return await this.columnsService.moveColumn(columnId, body);
  }

  @Patch(':columnId')
  public async patchColumn(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() body: PatchColumnDto,
  ): Promise<string> {
    return this.columnsService.patchColumn(columnId, body);
  }

  @Delete(':columnId')
  public async deleteColumn(@Param('columnId', ParseIntPipe) columnId: number): Promise<string> {
    return this.columnsService.deleteColumn(columnId);
  }
}
