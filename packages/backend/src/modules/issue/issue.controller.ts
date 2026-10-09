import type {
  TIssue,
  TStorageUploadData,
  TUploadIssueAttachmentsResponse,
} from '@kanban-board/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import StorageUploadMetaDto from '@/infrastructure/storage/libs/dtos/storage-upload-meta.dto';
import ParameterNumberPipe from '@/libs/pipes/parameter-number.pipe';
import StorageUploadMetaPipe from '@/libs/pipes/storage-upload-meta.pipe';
import { getSuccessResponseWithData } from '@/libs/utilities/response.utilities';
import { IssueService } from '@/modules/issue/issue.service';

@Controller('issues')
export default class IssueController {
  constructor(private issueService: IssueService) {}

  @Post('attachments')
  public async uploadingAttachments(
    @Body(StorageUploadMetaPipe)
    body: StorageUploadMetaDto[],
  ): Promise<TUploadIssueAttachmentsResponse> {
    const uploadData = await this.issueService.uploadIssueAttachments(body);
    return getSuccessResponseWithData<TStorageUploadData[]>(uploadData);
  }

  @Get(':issueId')
  public async getIssueById(
    @Param('issueId', new ParameterNumberPipe('http', { zero: false, negative: false }))
    issueId: number,
  ): Promise<TIssue> {
    return this.issueService.getIssueById(issueId);
  }
}
