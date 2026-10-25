import {
  createIssueBodySchema,
  EIssueEvent,
  getWsBoardRoomName,
  moveIssueBodySchema,
  positiveIdSchema,
  type TCreateIssueBodySchema,
  type TDeleteIssueEmitPayload,
  type TDeleteIssueResponse,
  type TIssueBase,
  type TMoveIssueBodySchema,
  type TMoveIssueEmitPayload,
  type TMoveIssueResponse,
  type TPositiveIdSchema,
  type TUpdateIssueBodySchema,
  type TUpsertIssueResponse,
  updateIssueBodySchema,
} from '@kanban-board/common';
import { UseFilters, UsePipes } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { Socket } from 'socket.io';

import WsExceptionFilter from '@/libs/filters/ws-exception.filter';
import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';
import { getSuccessResponseWithData } from '@/libs/utilities/response.utilities';
import IssueService from '@/modules/issue/issue.service';

@WebSocketGateway({ cors: { origin: true } })
@UseFilters(WsExceptionFilter)
@UsePipes(CustomValidationPipe.wsStandardSchemaPipe)
export default class IssueGateway {
  constructor(private issueService: IssueService) {}

  @SubscribeMessage(EIssueEvent.CREATE)
  public async createIssue(
    @MessageBody({ schema: createIssueBodySchema }) body: TCreateIssueBodySchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TUpsertIssueResponse> {
    const createdIssue = await this.issueService.createIssue(body);
    client.to(getWsBoardRoomName(createdIssue.boardId)).emit(EIssueEvent.CREATED, createdIssue);
    return getSuccessResponseWithData<TIssueBase>(createdIssue);
  }

  @SubscribeMessage(EIssueEvent.UPDATE)
  public async updateIssue(
    @MessageBody({ schema: updateIssueBodySchema })
    body: TUpdateIssueBodySchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TUpsertIssueResponse> {
    const updatedIssue = await this.issueService.updateIssue(body);
    client.to(getWsBoardRoomName(updatedIssue.boardId)).emit(EIssueEvent.UPDATED, updatedIssue);
    return getSuccessResponseWithData<TIssueBase>(updatedIssue);
  }

  @SubscribeMessage(EIssueEvent.DELETE)
  public async deleteIssue(
    @MessageBody({ schema: positiveIdSchema }) issueId: TPositiveIdSchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TDeleteIssueResponse> {
    const payload = await this.issueService.deleteIssue(issueId);
    client.to(getWsBoardRoomName(payload.boardId)).emit(EIssueEvent.DELETED, payload);
    return getSuccessResponseWithData<TDeleteIssueEmitPayload>(payload);
  }

  @SubscribeMessage(EIssueEvent.MOVE)
  public async moveIssue(
    @MessageBody({ schema: moveIssueBodySchema }) body: TMoveIssueBodySchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TMoveIssueResponse> {
    const payload = await this.issueService.moveIssue(body);
    client.to(getWsBoardRoomName(payload.boardId)).emit(EIssueEvent.MOVED, payload);
    return getSuccessResponseWithData<TMoveIssueEmitPayload>(payload);
  }
}
