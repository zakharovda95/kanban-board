import { EBoardEvent, type TCreateBoard, type TCreateBoardResponse } from '@kanban-board/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';

import { getSuccessResponseWithData } from '@/libs/utilities/response.utilities';
import { BoardService } from '@/modules/board/board.service';

@WebSocketGateway({
  cors: {
    origin: true,
  },
})
export default class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private boardService: BoardService) {}

  @WebSocketServer()
  server: Server;

  public handleConnection(@ConnectedSocket() client: Socket): void {
    console.log('Подключено', client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Отключено', client.id);
  }

  @SubscribeMessage(EBoardEvent.CREATE)
  public async createBoard(@MessageBody() body: TCreateBoard): Promise<TCreateBoardResponse> {
    const newBoard = await this.boardService.createBoard(body);

    this.server.emit(EBoardEvent.CREATED, newBoard);

    return getSuccessResponseWithData({ id: newBoard.id });
  }
}
