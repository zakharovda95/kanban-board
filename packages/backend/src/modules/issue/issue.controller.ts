import { positiveIdSchema, type TIssue, type TPositiveIdSchema } from '@kanban-board/common';
import { Controller, Get, Param } from '@nestjs/common';

import IssueService from '@/modules/issue/issue.service';

@Controller()
export default class IssueController {
  constructor(private issueService: IssueService) {}

  @Get('issues/:issueId')
  public async getIssueById(
    @Param('issueId', { schema: positiveIdSchema }) issueId: TPositiveIdSchema,
  ): Promise<TIssue> {
    return this.issueService.getIssueById(issueId);
  }
}
