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

@WebSocketGateway({
  cors: {
    origin: true,
  },
})
export default class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  public handleConnection(@ConnectedSocket() client: Socket): void {
    console.log('Подключено', client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Отключено', client.id);
  }

  @SubscribeMessage('test.test')
  public test(@MessageBody() message: string): string {
    this.server.emit('test.test', message);

    return message;
  }
}
