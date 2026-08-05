import { EBoardEvent, type TCreateBoardResponse } from '@kanban-board/common';
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
import { getSuccessResponseWithData } from '@/libs/utilities/response.utilities';
import { BoardService } from '@/modules/board/board.service';
import { CreateBoardDto } from '@/modules/board/libs/dtos/create-board.dto';

@UseFilters(WsExceptionFilter)
@WebSocketGateway({ cors: { origin: true } })
export default class BoardGateway {
  constructor(private boardService: BoardService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(EBoardEvent.CREATE)
  @UsePipes(CustomValidationPipe.wsValidationPipe)
  public async createBoard(@MessageBody() body: CreateBoardDto): Promise<TCreateBoardResponse> {
    const newBoard = await this.boardService.createBoard(body);

    this.server.emit(EBoardEvent.CREATED, newBoard);

    return getSuccessResponseWithData({ id: newBoard.id });
  }
}
