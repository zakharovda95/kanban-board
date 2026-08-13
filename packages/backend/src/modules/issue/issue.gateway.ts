import {
  EIssueEvent,
  type TDeleteIssueResponse,
  type TUpsertIssueResponse,
} from '@kanban-board/common';
import { UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { Socket } from 'socket.io';

import WsExceptionFilter from '@/libs/filters/ws-exception.filter';
import { CustomValidationPipe } from '@/libs/pipes/custom-validation.pipe';
import ParameterIdPipe from '@/libs/pipes/parameter-id.pipe';
import { RequireAnyPipe } from '@/libs/pipes/require-any.pipe';
import { getSuccessResponseWithData } from '@/libs/utilities/response.utilities';
import { IssueService } from '@/modules/issue/issue.service';
import { CreateIssueDto } from '@/modules/issue/libs/dtos/create-issue.dto';
import { UpdateIssueDto } from '@/modules/issue/libs/dtos/update-issue.dto';

@WebSocketGateway({ cors: { origin: true } })
@UseFilters(WsExceptionFilter)
export default class IssueGateway {
  constructor(private issueService: IssueService) {}

  @SubscribeMessage(EIssueEvent.CREATE)
  public async createIssue(
    @MessageBody(CustomValidationPipe.wsValidationPipe) body: CreateIssueDto,
    @ConnectedSocket() client: Socket,
  ): Promise<TUpsertIssueResponse> {
    const createdIssue = await this.issueService.createIssue(body);
    client.broadcast.emit(EIssueEvent.CREATED, createdIssue);
    return getSuccessResponseWithData(createdIssue);
  }

  @SubscribeMessage(EIssueEvent.UPDATE)
  public async updateIssue(
    @MessageBody(
      CustomValidationPipe.wsValidationPipe,
      new RequireAnyPipe(['title', 'description'], 'ws'),
    )
    body: UpdateIssueDto,
    @ConnectedSocket() client: Socket,
  ): Promise<TUpsertIssueResponse> {
    const updatedIssue = await this.issueService.updateIssue(body);
    client.broadcast.emit(EIssueEvent.UPDATED, updatedIssue);
    return getSuccessResponseWithData(updatedIssue);
  }

  @SubscribeMessage(EIssueEvent.DELETE)
  public async deleteIssue(
    @MessageBody(new ParameterIdPipe('ws')) issueId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<TDeleteIssueResponse> {
    const issuesAfterDeleting = await this.issueService.deleteIssue(issueId);
    client.broadcast.emit(EIssueEvent.DELETED, issuesAfterDeleting);
    return getSuccessResponseWithData(issuesAfterDeleting);
  }
}
