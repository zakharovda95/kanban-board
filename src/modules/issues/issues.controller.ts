import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { IssuesService } from '@/modules/issues/issues.service';
import { CreateIssueDto, MoveIssueDto, UpdateIssueDto } from '@/modules/issues/libs/issues.dtos';

@Controller('issues')
export class IssuesController {
  constructor(private issuesService: IssuesService) {}

  @Post()
  public async createIssue(@Body() body: CreateIssueDto): Promise<string> {
    return await this.issuesService.createIssue(body);
  }

  @Post(':issueId/move')
  public async moveIssue(
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body() body: MoveIssueDto,
  ): Promise<string> {
    return await this.issuesService.moveIssue(issueId, body);
  }

  @Get(':issueId')
  public async getIssueById(@Param('issueId', ParseIntPipe) issueId: number): Promise<string> {
    return this.issuesService.getIssueById(issueId);
  }

  @Put(':issueId')
  public async updateIssue(
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body() body: UpdateIssueDto,
  ): Promise<string> {
    return await this.issuesService.updateIssue(issueId, body);
  }

  @Delete(':issueId')
  public async deleteIssue(@Param('issueId', ParseIntPipe) issueId: number): Promise<string> {
    return await this.issuesService.deleteIssue(issueId);
  }
}
