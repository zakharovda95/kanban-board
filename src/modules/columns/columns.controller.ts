import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { ColumnsService } from '@/modules/columns/columns.service';
import { UpdateColumnDto } from '@/modules/columns/libs/columns.dtos';

@Controller('columns')
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  @Get()
  public async getColumns(): Promise<string> {
    return await this.columnsService.getColumns();
  }

  @Post()
  public async createColumn(): Promise<string> {
    return await this.columnsService.createColumn();
  }

  @Get(':id')
  public async getColumnById(@Param('id') columnId: number): Promise<string> {
    return this.columnsService.getColumnById(columnId);
  }

  @Post(':columnId/archive')
  public async archiveColumnById(@Param('columnId') columnId: number): Promise<string> {
    return this.columnsService.archiveColumnById(columnId);
  }

  @Patch(':columnId')
  public async updateColumnById(
    @Param('columnId') columnId: number,
    @Body() body: UpdateColumnDto,
  ): Promise<string> {
    return this.columnsService.updateColumnById(columnId, body);
  }

  @Delete(':columnId/issues')
  public async clearColumnById(@Param('columnId') columnId: number): Promise<string> {
    return this.columnsService.clearColumnById(columnId);
  }

  @Delete(':columnId')
  public async deleteColumnById(@Param('columnId') columnId: number): Promise<string> {
    return this.columnsService.deleteColumnById(columnId);
  }
}
