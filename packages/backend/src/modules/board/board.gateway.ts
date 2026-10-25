import {
  createBoardBodySchema,
  EBoardEvent,
  getWsBoardRoomName,
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
  updateBoardBodySchema,
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
import BoardService from '@/modules/board/board.service';

@WebSocketGateway({ cors: { origin: true } })
@UseFilters(WsExceptionFilter)
@UsePipes(CustomValidationPipe.wsStandardSchemaPipe)
export default class BoardGateway {
  constructor(private boardService: BoardService) {}

  @SubscribeMessage(EBoardEvent.JOIN)
  public async joinRoom(
    @MessageBody({ schema: positiveIdSchema }) boardId: TPositiveIdSchema,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.join(getWsBoardRoomName(boardId));
  }

  @SubscribeMessage(EBoardEvent.LEAVE)
  public async leaveRoom(
    @MessageBody({ schema: positiveIdSchema }) boardId: TPositiveIdSchema,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.leave(getWsBoardRoomName(boardId));
  }

  @SubscribeMessage(EBoardEvent.CREATE)
  public async createBoard(
    @MessageBody({ schema: createBoardBodySchema }) body: TCreateBoardBodySchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TUpsertBoardResponse> {
    const newBoard = await this.boardService.createBoard(body);
    client.broadcast.emit(EBoardEvent.CREATED, newBoard);
    return getSuccessResponseWithData<TBoardBase>(newBoard);
  }

  @SubscribeMessage(EBoardEvent.UPDATE)
  public async updateBoard(
    @MessageBody({ schema: updateBoardBodySchema })
    body: TUpdateBoardBodySchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TUpsertBoardResponse> {
    const updatedBoard = await this.boardService.updateBoard(body);
    client.broadcast.emit(EBoardEvent.UPDATED, updatedBoard);
    return getSuccessResponseWithData<TBoardBase>(updatedBoard);
  }

  @SubscribeMessage(EBoardEvent.DELETE)
  public async deleteBoard(
    @MessageBody({ schema: positiveIdSchema }) boardId: TPositiveIdSchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TDeleteBoardResponse> {
    const payload = await this.boardService.deleteBoard(boardId);
    client.broadcast.emit(EBoardEvent.DELETED, payload);
    return getSuccessResponseWithData<TDeleteBoardEmitPayload>(payload);
  }

  @SubscribeMessage(EBoardEvent.MOVE)
  public async moveBoard(
    @MessageBody({ schema: moveParametersBodySchema }) body: TMoveParametersBodySchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TMoveBoardResponse> {
    const payload = await this.boardService.moveBoard(body);
    client.broadcast.emit(EBoardEvent.MOVED, payload);
    return getSuccessResponseWithData<TMoveBoardEmitPayload>(payload);
  }
}
