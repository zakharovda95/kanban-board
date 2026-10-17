import {
  EIssueEvent,
  getWsBoardRoomName,
  type TDeleteIssueEmitPayload,
  type TDeleteIssueResponse,
  type TIssueBase,
  type TMoveIssueEmitPayload,
  type TMoveIssueResponse,
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
import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';
import ParameterIdPipe from '@/libs/pipes/parameter-id.pipe';
import RequireAnyPipe from '@/libs/pipes/require-any.pipe';
import { getSuccessResponseWithData } from '@/libs/utilities/response.utilities';
import IssueService from '@/modules/issue/issue.service';
import CreateIssueDto from '@/modules/issue/libs/dtos/create-issue.dto';
import MoveIssueDto from '@/modules/issue/libs/dtos/move-issue.dto';
import UpdateIssueDto from '@/modules/issue/libs/dtos/update-issue.dto';

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
    client.to(getWsBoardRoomName(createdIssue.boardId)).emit(EIssueEvent.CREATED, createdIssue);
    return getSuccessResponseWithData<TIssueBase>(createdIssue);
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
    client.to(getWsBoardRoomName(updatedIssue.boardId)).emit(EIssueEvent.UPDATED, updatedIssue);
    return getSuccessResponseWithData<TIssueBase>(updatedIssue);
  }

  @SubscribeMessage(EIssueEvent.DELETE)
  public async deleteIssue(
    @MessageBody(new ParameterIdPipe('ws')) issueId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<TDeleteIssueResponse> {
    const payload = await this.issueService.deleteIssue(issueId);
    client.to(getWsBoardRoomName(payload.boardId)).emit(EIssueEvent.DELETED, payload);
    return getSuccessResponseWithData<TDeleteIssueEmitPayload>(payload);
  }

  @SubscribeMessage(EIssueEvent.MOVE)
  public async moveIssue(
    @MessageBody(CustomValidationPipe.wsValidationPipe) body: MoveIssueDto,
    @ConnectedSocket() client: Socket,
  ): Promise<TMoveIssueResponse> {
    const payload = await this.issueService.moveIssue(body);
    client.to(getWsBoardRoomName(payload.boardId)).emit(EIssueEvent.MOVED, payload);
    return getSuccessResponseWithData<TMoveIssueEmitPayload>(payload);
  }
}
