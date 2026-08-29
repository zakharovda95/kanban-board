import {
  EBoardEvent,
  getWsBoardRoomName,
  type TBoardBase,
  type TDeleteBoardEmitPayload,
  type TDeleteBoardResponse,
  type TMoveBoardEmitPayload,
  type TMoveBoardResponse,
  type TUpsertBoardResponse,
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
import { BoardService } from '@/modules/board/board.service';
import { CreateBoardDto } from '@/modules/board/libs/dtos/create-board.dto';
import { UpdateBoardDto } from '@/modules/board/libs/dtos/update-board.dto';
import { MoveParametersDto } from '@/modules/shared/move/libs/dto/move-parameters.dto';

@WebSocketGateway({ cors: { origin: true } })
@UseFilters(WsExceptionFilter)
export default class BoardGateway {
  constructor(private boardService: BoardService) {}

  @SubscribeMessage(EBoardEvent.JOIN)
  public async joinRoom(
    @MessageBody(new ParameterIdPipe('ws')) boardId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.join(getWsBoardRoomName(boardId));
  }

  @SubscribeMessage(EBoardEvent.LEAVE)
  public async leaveRoom(
    @MessageBody(new ParameterIdPipe('ws')) boardId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.leave(getWsBoardRoomName(boardId));
  }

  @SubscribeMessage(EBoardEvent.CREATE)
  public async createBoard(
    @MessageBody(CustomValidationPipe.wsValidationPipe) body: CreateBoardDto,
    @ConnectedSocket() client: Socket,
  ): Promise<TUpsertBoardResponse> {
    const newBoard = await this.boardService.createBoard(body);
    client.broadcast.emit(EBoardEvent.CREATED, newBoard);
    return getSuccessResponseWithData<TBoardBase>(newBoard);
  }

  @SubscribeMessage(EBoardEvent.UPDATE)
  public async updateBoard(
    @MessageBody(
      CustomValidationPipe.wsValidationPipe,
      new RequireAnyPipe(['title', 'description'], 'ws'),
    )
    body: UpdateBoardDto,
    @ConnectedSocket() client: Socket,
  ): Promise<TUpsertBoardResponse> {
    const updatedBoard = await this.boardService.updateBoard(body);
    client.broadcast.emit(EBoardEvent.UPDATED, updatedBoard);
    return getSuccessResponseWithData<TBoardBase>(updatedBoard);
  }

  @SubscribeMessage(EBoardEvent.DELETE)
  public async deleteBoard(
    @MessageBody(new ParameterIdPipe('ws')) boardId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<TDeleteBoardResponse> {
    const payload = await this.boardService.deleteBoard(boardId);
    client.broadcast.emit(EBoardEvent.DELETED, payload);
    return getSuccessResponseWithData<TDeleteBoardEmitPayload>(payload);
  }

  @SubscribeMessage(EBoardEvent.MOVE)
  public async moveBoard(
    @MessageBody(CustomValidationPipe.wsValidationPipe) body: MoveParametersDto,
    @ConnectedSocket() client: Socket,
  ): Promise<TMoveBoardResponse> {
    const payload = await this.boardService.moveBoard(body);
    client.broadcast.emit(EBoardEvent.MOVED, payload);
    return getSuccessResponseWithData<TMoveBoardEmitPayload>(payload);
  }
}
