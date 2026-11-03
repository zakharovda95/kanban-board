import { EWorkspaceEvent, getWsWorkspaceRoomName, type TUser } from '@kanban-board/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { UseFilters, UsePipes } from '@nestjs/common';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import type { Socket } from 'socket.io';

import { WS_CORS_OPTIONS } from '@/libs/constants/websocket.constants';
import WsExceptionFilter from '@/libs/filters/ws-exception.filter';
import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';

/**
 * Комната рабочего пространства.
 * События списка досок уходят только ее участникам.
 * Идентификатор берется из сессии, поэтому клиент не выбирает комнату сам.
 * **/
@WebSocketGateway({ cors: WS_CORS_OPTIONS })
@UseFilters(WsExceptionFilter)
@UsePipes(CustomValidationPipe.wsStandardSchemaPipe)
export default class WorkspaceGateway {
  @Can.Anyone()
  @SubscribeMessage(EWorkspaceEvent.JOIN)
  public async joinRoom(
    @CurrentUser() me: TUser,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.join(getWsWorkspaceRoomName(me.userWorkspace.workspaceId));
  }

  @Can.Anyone()
  @SubscribeMessage(EWorkspaceEvent.LEAVE)
  public async leaveRoom(
    @CurrentUser() me: TUser,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.leave(getWsWorkspaceRoomName(me.userWorkspace.workspaceId));
  }
}
