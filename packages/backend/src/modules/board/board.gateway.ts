import {
  EBoardEvent,
  type TCreateBoardResponse,
  type TDeleteBoardResponse,
  type TSuccessResponse,
} from '@kanban-board/common';
import { UseFilters, UsePipes } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server } from 'socket.io';

import WsExceptionFilter from '@/libs/filters/ws-exception.filter';
import { CustomValidationPipe } from '@/libs/pipes/custom-validation.pipe';
import ParameterIdPipe from '@/libs/pipes/parameter-id.pipe';
import { RequireAnyPipe } from '@/libs/pipes/require-any.pipe';
import {
  getSuccessResponse,
  getSuccessResponseWithData,
} from '@/libs/utilities/response.utilities';
import { BoardService } from '@/modules/board/board.service';
import { CreateBoardDto } from '@/modules/board/libs/dtos/create-board.dto';
import { UpdateBoardDto } from '@/modules/board/libs/dtos/update-board.dto';

@WebSocketGateway({ cors: { origin: true } })
@UsePipes(CustomValidationPipe.wsValidationPipe)
@UseFilters(WsExceptionFilter)
export default class BoardGateway {
  constructor(private boardService: BoardService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(EBoardEvent.CREATE)
  public async createBoard(@MessageBody() body: CreateBoardDto): Promise<TCreateBoardResponse> {
    const newBoard = await this.boardService.createBoard(body);
    this.server.emit(EBoardEvent.CREATED, newBoard);
    return getSuccessResponseWithData({ id: newBoard.id });
  }

  @SubscribeMessage(EBoardEvent.UPDATE)
  public async updateBoard(
    @MessageBody(new RequireAnyPipe(['title', 'description'], 'ws')) body: UpdateBoardDto,
  ): Promise<TSuccessResponse> {
    const updatedBoard = await this.boardService.updateBoard(body);
    this.server.emit(EBoardEvent.UPDATED, updatedBoard);
    return getSuccessResponse();
  }

  @SubscribeMessage(EBoardEvent.DELETE)
  public async deleteBoard(
    @MessageBody(new ParameterIdPipe('ws')) boardId: number,
  ): Promise<TDeleteBoardResponse> {
    const boardsAfterDeleting = await this.boardService.deleteBoard(boardId);
    this.server.emit(EBoardEvent.DELETED, boardsAfterDeleting);
    return getSuccessResponseWithData({ id: boardsAfterDeleting.deletedBoardId });
  }
}
