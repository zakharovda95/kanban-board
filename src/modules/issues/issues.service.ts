import { Injectable } from '@nestjs/common';

import { sleep } from '@/libs/utils/sleep.utils';
import type {
  TCreateIssue,
  TMoveIssue,
  TUpdateIssue,
} from '@/modules/issues/libs/types/issues.types';

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

  public async updateIssue(issueId: number, body: TUpdateIssue): Promise<string> {
    await sleep();
    return `Issue with id ${issueId} was updated with data ${JSON.stringify(body)}!`;
  }

  public async deleteIssue(issueId: number): Promise<string> {
    await sleep();
    return `Issue with id ${issueId} was deleted!`;
  }

  public async moveIssue(issueId: number, body: TMoveIssue): Promise<string> {
    await sleep();
    return `Issue with id ${issueId} was moved with data ${JSON.stringify(body)}!`;
  }
}
