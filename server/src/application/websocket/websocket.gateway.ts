import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'https://z4nr.github.io/WhatBorder/',
  },
  transports: ['websocket'],
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('search-client')
  handleSearchClient(client: any, @MessageBody() data: any): WsResponse<any> {
    try {
      console.log('Received message:', data);
      this.server.emit('get-client', data);
    } catch (error) {
      console.error('Error handling message:', error);
      return { event: 'exception', data: { error: 'Internal server error' } };
    }
  }

  @SubscribeMessage('set-list')
  handleSetClientList(client: any, @MessageBody() data: any): WsResponse<any> {
    try {
      console.log('Received message list:', data);
      this.server.emit('list-client-create', data);
    } catch (error) {
      console.error('Error handling message:', error);
      return { event: 'exception', data: { error: 'Internal server error' } };
    }
  }

  @SubscribeMessage('logout-device')
  handleLogoutDevice(client: any, @MessageBody() data: any): WsResponse<any> {
    try {
      console.log('Received message:', data);
      this.server.emit('delete-client-create', data);
    } catch (error) {
      console.error('Error handling message:', error);
      return { event: 'exception', data: { error: 'Internal server error' } };
    }
  }

  @SubscribeMessage('client')
  handleChoosenClient(client: any, @MessageBody() data: any): WsResponse<any> {
    try {
      console.log('Received message:', data);
      this.server.emit('choosen-client', data);
    } catch (error) {
      console.error('Error handling message:', error);
      return { event: 'exception', data: { error: 'Internal server error' } };
    }
  }

  @SubscribeMessage('reject-choice')
  handleRejectClient(client: any, @MessageBody() data: any): WsResponse<any> {
    try {
      console.log('Received message:', data);
      this.server.emit('reject-client-create', data);
    } catch (error) {
      console.error('Error handling message:', error);
      return { event: 'exception', data: { error: 'Internal server error' } };
    }
  }

  @SubscribeMessage('accept-choice')
  handleAcceptClient(client: any, @MessageBody() data: any): WsResponse<any> {
    try {
      console.log('Received message:', data);
      this.server.emit('accept-client', data);
    } catch (error) {
      console.error('Error handling message:', error);
      return { event: 'exception', data: { error: 'Internal server error' } };
    }
  }

  @SubscribeMessage('backto-dashboard')
  handleBackDashboard(client: any, @MessageBody() data: any): WsResponse<any> {
    try {
      console.log('Received message:', data);
      this.server.emit('navigateto-dashboard', data);
    } catch (error) {
      console.error('Error handling message:', error);
      return { event: 'exception', data: { error: 'Internal server error' } };
    }
  }

  @SubscribeMessage('set-centerpoint')
  handleCenterPoint(client: any, @MessageBody() data: any): WsResponse<any> {
    try {
      console.log('Received message:', data);
      this.server.emit('centerpoint', data);
    } catch (error) {
      console.error('Error handling message:', error);
      return { event: 'exception', data: { error: 'Internal server error' } };
    }
  }

  @SubscribeMessage('set-place-coordinate')
  handlePlaceCoordinate(
    client: any,
    @MessageBody() data: any,
  ): WsResponse<any> {
    try {
      console.log('Received message:', data);
      this.server.emit('place-coordinate', data);
    } catch (error) {
      console.error('Error handling message:', error);
      return { event: 'exception', data: { error: 'Internal server error' } };
    }
  }
}
