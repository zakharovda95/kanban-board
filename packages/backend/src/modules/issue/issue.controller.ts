import type { TIssue } from '@kanban-board/common';
import { Controller, Get, Param } from '@nestjs/common';

import ParameterNumberPipe from '@/libs/pipes/parameter-number.pipe';
import IssueService from '@/modules/issue/issue.service';

@Controller()
export default class IssueController {
  constructor(private issueService: IssueService) {}

  @Get('issues/:issueId')
  public async getIssueById(
    @Param('issueId', new ParameterNumberPipe('http', { zero: false, negative: false }))
    issueId: number,
  ): Promise<TIssue> {
    return this.issueService.getIssueById(issueId);
  }
}
