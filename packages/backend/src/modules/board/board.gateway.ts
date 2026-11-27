import {
  createBoardBodySchema,
  EBoardEvent,
  getWsBoardRoomName,
  getWsWorkspaceRoomName,
  moveParametersBodySchema,
  positiveIdSchema,
  type TBoardBase,
  type TCreateBoardBodySchema,
  type TDeleteBoardEmitPayload,
  type TDeleteBoardResponse,
  type TMoveBoardEmitPayload,
  type TMoveBoardResponse,
  type TMoveParametersBodySchema,
  type TPositiveIdSchema,
  type TUpdateBoardBodySchema,
  type TUpsertBoardResponse,
  type TUser,
  updateBoardBodySchema,
} from '@kanban-board/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { UseFilters, UsePipes } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { Socket } from 'socket.io';

import { WS_CORS_OPTIONS } from '@/libs/constants/websocket.constants';
import WsExceptionFilter from '@/libs/filters/ws-exception.filter';
import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';
import { data } from '@/libs/utilities/can.utilities';
import { getSuccessResponseWithData } from '@/libs/utilities/response.utilities';
import BoardService from '@/modules/board/board.service';
import BoardPolicy from '@/modules/board/libs/policies/board.policy';

@WebSocketGateway({ cors: WS_CORS_OPTIONS })
@UseFilters(WsExceptionFilter)
@UsePipes(CustomValidationPipe.wsStandardSchemaPipe)
export default class BoardGateway {
  constructor(private boardService: BoardService) {}

  @Can(BoardPolicy, 'joinRoom', data())
  @SubscribeMessage(EBoardEvent.JOIN)
  public async joinRoom(
    @MessageBody({ schema: positiveIdSchema }) boardId: TPositiveIdSchema,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.join(getWsBoardRoomName(boardId));
  }

  @Can.Anyone()
  @SubscribeMessage(EBoardEvent.LEAVE)
  public async leaveRoom(
    @MessageBody({ schema: positiveIdSchema }) boardId: TPositiveIdSchema,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.leave(getWsBoardRoomName(boardId));
  }

  @Can(BoardPolicy, 'createBoard')
  @SubscribeMessage(EBoardEvent.CREATE)
  public async createBoard(
    @CurrentUser() me: TUser,
    @MessageBody({ schema: createBoardBodySchema }) body: TCreateBoardBodySchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TUpsertBoardResponse> {
    const newBoard = await this.boardService.createBoard(me.workspaceId, body);
    client.to(getWsWorkspaceRoomName(me.workspaceId)).emit(EBoardEvent.CREATED, newBoard);
    return getSuccessResponseWithData<TBoardBase>(newBoard);
  }

  @Can(BoardPolicy, 'updateBoard', data('id'))
  @SubscribeMessage(EBoardEvent.UPDATE)
  public async updateBoard(
    @CurrentUser() me: TUser,
    @MessageBody({ schema: updateBoardBodySchema })
    body: TUpdateBoardBodySchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TUpsertBoardResponse> {
    const updatedBoard = await this.boardService.updateBoard(body);
    client.to(getWsWorkspaceRoomName(me.workspaceId)).emit(EBoardEvent.UPDATED, updatedBoard);
    return getSuccessResponseWithData<TBoardBase>(updatedBoard);
  }

  @Can(BoardPolicy, 'deleteBoard', data())
  @SubscribeMessage(EBoardEvent.DELETE)
  public async deleteBoard(
    @CurrentUser() me: TUser,
    @MessageBody({ schema: positiveIdSchema }) boardId: TPositiveIdSchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TDeleteBoardResponse> {
    const payload = await this.boardService.deleteBoard(boardId);
    client.to(getWsWorkspaceRoomName(me.workspaceId)).emit(EBoardEvent.DELETED, payload);
    return getSuccessResponseWithData<TDeleteBoardEmitPayload>(payload);
  }

  @Can(BoardPolicy, 'moveBoard')
  @SubscribeMessage(EBoardEvent.MOVE)
  public async moveBoard(
    @CurrentUser() me: TUser,
    @MessageBody({ schema: moveParametersBodySchema }) body: TMoveParametersBodySchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TMoveBoardResponse> {
    const payload = await this.boardService.moveBoard(me.workspaceId, body);
    client.to(getWsWorkspaceRoomName(me.workspaceId)).emit(EBoardEvent.MOVED, payload);
    return getSuccessResponseWithData<TMoveBoardEmitPayload>(payload);
  }
}
