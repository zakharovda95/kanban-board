import { Injectable, Put } from '@nestjs/common';

import { sleep } from '@/libs/utils/sleep.utils';
import type { TCreateIssue, TPatchIssue, TUpdateIssue } from '@/modules/issues/libs/issues.types';

@Injectable()
export class IssuesService {
  public async createIssue(body: TCreateIssue): Promise<string> {
    await sleep();
    return `New issue was created! ${JSON.stringify(body)}`;
  }

  public async getIssueById(issueId: number): Promise<string> {
    await sleep();
    return `Get issue with id ${issueId}!`;
  }

  @Put(':issueId')
  public async updateIssueById(issueId: number, body: TUpdateIssue): Promise<string> {
    await sleep();
    return `Issue with id ${issueId} was updated with data ${JSON.stringify(body)}!`;
  }

  /** Переместить задачу в другую колонку. **/
  public async patchIssueById(issueId: number, body: TPatchIssue): Promise<string> {
    await sleep();
    return `Issue with id ${issueId} was updated with data ${JSON.stringify(body)}!`;
  }
}
