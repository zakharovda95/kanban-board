import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { IssueService } from '@/modules/issue/issue.service';
import { CreateIssueDto } from '@/modules/issue/libs/dtos/create-issue.dto';
import { UpdateIssueDto } from '@/modules/issue/libs/dtos/update-issue.dto';
import { MoveParametersDto } from '@/modules/shared/move/libs/dto/move-parameters.dto';
import { MovePipe } from '@/modules/shared/move/libs/pipes/move.pipe';

@Controller()
export class IssueController {
  constructor(private issueService: IssueService) {}

  @Post('columns/:columnId/issues')
  public async createIssue(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() body: CreateIssueDto,
  ): Promise<string> {
    return await this.issueService.createIssue(body);
  }

  @Post('issues/:issueId/move')
  @HttpCode(HttpStatus.OK)
  public async moveIssue(
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body(MovePipe) body: MoveParametersDto,
  ): Promise<string> {
    return await this.issueService.moveIssue(issueId, body);
  }

  @Get('issues/:issueId')
  public async getIssueById(@Param('issueId', ParseIntPipe) issueId: number): Promise<string> {
    return this.issueService.getIssueById(issueId);
  }

  @Put('issues/:issueId')
  public async updateIssue(
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body() body: UpdateIssueDto,
  ): Promise<string> {
    return await this.issueService.updateIssue(issueId, body);
  }

  @Delete('issues/:issueId')
  public async deleteIssue(@Param('issueId', ParseIntPipe) issueId: number): Promise<string> {
    return await this.issueService.deleteIssue(issueId);
  }
}
