import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { sleep } from '@/libs/utils/sleep.utils';
import { NewIssueDto } from '@/modules/issues/dtos/new-issue.dto';

@Controller('issues')
export class IssuesController {
  /** Метод не нужен тк колонки и задачи приходят вместе с доской (реализован как системный метод). **/
  @Get()
  public async getIssues(): Promise<string> {
    await sleep();
    return 'Get all issues!';
  }

  /** Создание новой задачи. **/
  @Post()
  public async createIssue(@Body() body: NewIssueDto): Promise<string> {
    await sleep();
    return `New issue was created! ${JSON.stringify(body)}`;
  }

  /** Просмотр детальной задачи. **/
  @Get(':id')
  public async getIssueById(@Param('id') issueId: number): Promise<string> {
    await sleep();
    return `Get issue with id ${issueId}!`;
  }
}
