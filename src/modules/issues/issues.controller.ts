import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';

import { IssuesService } from '@/modules/issues/issues.service';
import { CreateIssueDto, PatchIssueDto, UpdateIssueDto } from '@/modules/issues/libs/issues.dtos';

@Controller('issues')
export class IssuesController {
  constructor(private issuesService: IssuesService) {}

  @Post()
  public async createIssue(@Body() body: CreateIssueDto): Promise<string> {
    return await this.issuesService.createIssue(body);
  }

  @Get(':issueId')
  public async getIssueById(@Param('issueId') issueId: number): Promise<string> {
    return this.issuesService.getIssueById(issueId);
  }

  @Put(':issueId')
  public async updateIssueById(
    @Param('issueId') issueId: number,
    @Body() body: UpdateIssueDto,
  ): Promise<string> {
    return await this.issuesService.updateIssueById(issueId, body);
  }

  /** Переместить задачу в другую колонку. **/
  @Patch(':issueId')
  public async patchIssueById(
    @Param('issueId') issueId: number,
    @Body() body: PatchIssueDto,
  ): Promise<string> {
    return await this.issuesService.patchIssueById(issueId, body);
  }
}
