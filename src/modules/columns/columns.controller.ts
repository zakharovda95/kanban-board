import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';

import { ColumnsService } from '@/modules/columns/columns.service';
import { PatchColumnDto } from '@/modules/columns/libs/columns.dtos';

@Controller('columns')
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  @Post()
  public async createColumn(): Promise<string> {
    return await this.columnsService.createColumn();
  }

  @Patch(':columnId')
  public async patchColumnById(
    @Param('columnId') columnId: number,
    @Body() body: PatchColumnDto,
  ): Promise<string> {
    return this.columnsService.patchColumnById(columnId, body);
  }

  @Delete(':columnId')
  public async deleteColumnById(@Param('columnId') columnId: number): Promise<string> {
    return this.columnsService.deleteColumnById(columnId);
  }
}
