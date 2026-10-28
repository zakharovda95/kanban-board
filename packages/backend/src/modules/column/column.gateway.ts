import {
  createColumnBodySchema,
  EColumnEvent,
  getWsBoardRoomName,
  moveColumnBodySchema,
  positiveIdSchema,
  type TColumn,
  type TColumnBase,
  type TCreateColumnBodySchema,
  type TCreateColumnResponse,
  type TDeleteColumnEmitPayload,
  type TDeleteColumnResponse,
  type TMoveColumnBodySchema,
  type TMoveColumnEmitPayload,
  type TMoveColumnResponse,
  type TPositiveIdSchema,
  type TUpdateColumnBodySchema,
  type TUpdateColumnResponse,
  updateColumnBodySchema,
} from '@kanban-board/common';
import { Can } from '@nestjs/authorization';
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
import ColumnService from '@/modules/column/column.service';

@WebSocketGateway({ cors: { origin: true } })
@UseFilters(WsExceptionFilter)
@UsePipes(CustomValidationPipe.wsStandardSchemaPipe)
export default class ColumnGateway {
  constructor(private columnService: ColumnService) {}

  @Can.Anyone()
  @SubscribeMessage(EColumnEvent.CREATE)
  public async createColumn(
    @MessageBody({ schema: createColumnBodySchema }) body: TCreateColumnBodySchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TCreateColumnResponse> {
    const createdColumn = await this.columnService.createColumn(body);
    client.to(getWsBoardRoomName(createdColumn.boardId)).emit(EColumnEvent.CREATED, createdColumn);
    return getSuccessResponseWithData<TColumn>(createdColumn);
  }

  @Can.Anyone()
  @SubscribeMessage(EColumnEvent.UPDATE)
  public async updateColumn(
    @MessageBody({ schema: updateColumnBodySchema })
    body: TUpdateColumnBodySchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TUpdateColumnResponse> {
    const updatedColumn = await this.columnService.updateColumn(body);
    client.to(getWsBoardRoomName(updatedColumn.boardId)).emit(EColumnEvent.UPDATED, updatedColumn);
    return getSuccessResponseWithData<TColumnBase>(updatedColumn);
  }

  @Can.Anyone()
  @SubscribeMessage(EColumnEvent.DELETE)
  public async deleteColumn(
    @MessageBody({ schema: positiveIdSchema }) columnId: TPositiveIdSchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TDeleteColumnResponse> {
    const payload = await this.columnService.deleteColumn(columnId);
    client.to(getWsBoardRoomName(payload.boardId)).emit(EColumnEvent.DELETED, payload);
    return getSuccessResponseWithData<TDeleteColumnEmitPayload>(payload);
  }

  @Can.Anyone()
  @SubscribeMessage(EColumnEvent.MOVE)
  public async moveColumn(
    @MessageBody({ schema: moveColumnBodySchema }) body: TMoveColumnBodySchema,
    @ConnectedSocket() client: Socket,
  ): Promise<TMoveColumnResponse> {
    const payload = await this.columnService.moveColumn(body);
    client.to(getWsBoardRoomName(payload.boardId)).emit(EColumnEvent.MOVED, payload);
    return getSuccessResponseWithData<TMoveColumnEmitPayload>(payload);
  }
}
