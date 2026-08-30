import {
  EColumnEvent,
  getWsBoardRoomName,
  type TColumn,
  type TDeleteColumnEmitPayload,
  type TDeleteColumnResponse,
  type TMoveColumnEmitPayload,
  type TMoveColumnResponse,
  type TUpsertColumnResponse,
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
import ColumnService from '@/modules/column/column.service';
import CreateColumnDto from '@/modules/column/libs/dtos/create-column.dto';
import MoveColumnDto from '@/modules/column/libs/dtos/move-column.dto';
import UpdateColumnDto from '@/modules/column/libs/dtos/update-column.dto';

@WebSocketGateway({ cors: { origin: true } })
@UseFilters(WsExceptionFilter)
export default class ColumnGateway {
  constructor(private columnService: ColumnService) {}

  @SubscribeMessage(EColumnEvent.CREATE)
  public async createColumn(
    @MessageBody(CustomValidationPipe.wsValidationPipe) body: CreateColumnDto,
    @ConnectedSocket() client: Socket,
  ): Promise<TUpsertColumnResponse> {
    const createdColumn = await this.columnService.createColumn(body);
    client.to(getWsBoardRoomName(createdColumn.boardId)).emit(EColumnEvent.CREATED, createdColumn);
    return getSuccessResponseWithData<TColumn>(createdColumn);
  }

  @SubscribeMessage(EColumnEvent.UPDATE)
  public async updateColumn(
    @MessageBody(
      CustomValidationPipe.wsValidationPipe,
      new RequireAnyPipe(['color', 'title', 'description'], 'ws'),
    )
    body: UpdateColumnDto,
    @ConnectedSocket() client: Socket,
  ): Promise<TUpsertColumnResponse> {
    const updatedColumn = await this.columnService.updateColumn(body);
    client.to(getWsBoardRoomName(updatedColumn.boardId)).emit(EColumnEvent.UPDATED, updatedColumn);
    return getSuccessResponseWithData<TColumn>(updatedColumn);
  }

  @SubscribeMessage(EColumnEvent.DELETE)
  public async deleteColumn(
    @MessageBody(new ParameterIdPipe('ws')) columnId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<TDeleteColumnResponse> {
    const payload = await this.columnService.deleteColumn(columnId);
    client.to(getWsBoardRoomName(payload.boardId)).emit(EColumnEvent.DELETED, payload);
    return getSuccessResponseWithData<TDeleteColumnEmitPayload>(payload);
  }

  @SubscribeMessage(EColumnEvent.MOVE)
  public async moveColumn(
    @MessageBody(CustomValidationPipe.wsValidationPipe) body: MoveColumnDto,
    @ConnectedSocket() client: Socket,
  ): Promise<TMoveColumnResponse> {
    const payload = await this.columnService.moveColumn(body);
    client.to(getWsBoardRoomName(payload.boardId)).emit(EColumnEvent.MOVED, payload);
    return getSuccessResponseWithData<TMoveColumnEmitPayload>(payload);
  }
}
