import {
  EBoardEvent,
  type TCreateBoardResponse,
  type TDeleteBoardResponse,
  type TUpdateBoardResponse,
} from '@kanban-board/common';
import { UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';

import WsExceptionFilter from '@/libs/filters/ws-exception.filter';
import { CustomValidationPipe } from '@/libs/pipes/custom-validation.pipe';
import ParameterIdPipe from '@/libs/pipes/parameter-id.pipe';
import { RequireAnyPipe } from '@/libs/pipes/require-any.pipe';
import { getSuccessResponseWithData } from '@/libs/utilities/response.utilities';
import { BoardService } from '@/modules/board/board.service';
import { CreateBoardDto } from '@/modules/board/libs/dtos/create-board.dto';
import { UpdateBoardDto } from '@/modules/board/libs/dtos/update-board.dto';

@WebSocketGateway({ cors: { origin: true } })
@UseFilters(WsExceptionFilter)
export default class BoardGateway {
  constructor(private boardService: BoardService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(EBoardEvent.CREATE)
  public async createBoard(
    @MessageBody(CustomValidationPipe.wsValidationPipe) body: CreateBoardDto,
    @ConnectedSocket() client: Socket,
  ): Promise<TCreateBoardResponse> {
    const newBoard = await this.boardService.createBoard(body);
    client.broadcast.emit(EBoardEvent.CREATED, newBoard);
    return getSuccessResponseWithData(newBoard);
  }

  @SubscribeMessage(EBoardEvent.UPDATE)
  public async updateBoard(
    @MessageBody(
      CustomValidationPipe.wsValidationPipe,
      new RequireAnyPipe(['title', 'description'], 'ws'),
    )
    body: UpdateBoardDto,
    @ConnectedSocket() client: Socket,
  ): Promise<TUpdateBoardResponse> {
    const updatedBoard = await this.boardService.updateBoard(body);
    client.broadcast.emit(EBoardEvent.UPDATED, updatedBoard);
    return getSuccessResponseWithData(updatedBoard);
  }

  @SubscribeMessage(EBoardEvent.DELETE)
  public async deleteBoard(
    @MessageBody(new ParameterIdPipe('ws')) boardId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<TDeleteBoardResponse> {
    const boardsAfterDeleting = await this.boardService.deleteBoard(boardId);
    client.broadcast.emit(EBoardEvent.DELETED, boardsAfterDeleting);
    return getSuccessResponseWithData(boardsAfterDeleting);
  }
}
