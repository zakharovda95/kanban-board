import { Injectable } from '@nestjs/common';

import { sleep } from '@/libs/utils/sleep.utils';
import type { TCreateIssue, TUpdateIssue } from '@/modules/issue/libs/types/issue.types';
import { TMoveParameters } from '@/modules/libs/types/move.types';

@Injectable()
export class IssueService {
  public async createIssue(body: TCreateIssue): Promise<string> {
    await sleep();
    return `New issue was created! ${JSON.stringify(body)}`;
  }

  public async getIssueById(issueId: number): Promise<string> {
    await sleep();
    return `Get issue with id ${issueId}!`;
  }

  public async updateIssue(issueId: number, body: TUpdateIssue): Promise<string> {
    await sleep();
    return `Issue with id ${issueId} was updated with data ${JSON.stringify(body)}!`;
  }

  public async deleteIssue(issueId: number): Promise<string> {
    await sleep();
    return `Issue with id ${issueId} was deleted!`;
  }

  public async moveIssue(issueId: number, body: TMoveParameters): Promise<string> {
    await sleep();
    return `Issue with id ${issueId} was moved with data ${JSON.stringify(body)}!`;
  }
}
