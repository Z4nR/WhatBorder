import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, data: any): WsResponse<any> {
    try {
      console.log('Received message:', data);
      const event = 'order';
      return { event, data };
    } catch (error) {
      console.error('Error handling message:', error);
      return { event: 'exception', data: { error: 'Internal server error' } };
    }
  }
}
