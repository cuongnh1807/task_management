import { Inject, Injectable } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RealtimeService } from './services/realtime.service';

@Injectable()
@WebSocketGateway({
  cors: true,
  namespace: 'notifications',
})
@SkipThrottle()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  @Inject()
  private realtimeService: RealtimeService;

  afterInit() {
    console.log('Socket Inited');
    this.realtimeService.setServer(this.server);
  }

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }
}
