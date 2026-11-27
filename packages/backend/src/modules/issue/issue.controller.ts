import { positiveIdSchema, type TIssue, type TPositiveIdSchema } from '@kanban-board/common';
import { Can } from '@nestjs/authorization';
import { Controller, Get, Param, UsePipes } from '@nestjs/common';

import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';
import { param } from '@/libs/utilities/can.utilities';
import IssueService from '@/modules/issue/issue.service';
import IssuePolicy from '@/modules/issue/libs/policies/issue.policy';

@Controller()
@UsePipes(CustomValidationPipe.httpStandardSchemaPipe)
export default class IssueController {
  constructor(private issueService: IssueService) {}

  @Can(IssuePolicy, 'getIssueById', param('issueId'))
  @Get('issues/:issueId')
  public async getIssueById(
    @Param('issueId', { schema: positiveIdSchema }) issueId: TPositiveIdSchema,
  ): Promise<TIssue> {
    return this.issueService.getIssueById(issueId);
  }
}
