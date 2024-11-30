import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';

@Injectable()
export class RealtimeService {
  @WebSocketServer()
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  sendMessageBoardCast<T>(event: string, data: string | T = '') {
    console.log(event);
    this.server.emit(event, { message: data });
  }
}
