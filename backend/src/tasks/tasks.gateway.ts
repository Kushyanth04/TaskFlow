import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/ws',
})
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinWorkspace')
  handleJoinWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() workspaceId: string,
  ) {
    client.join(`workspace:${workspaceId}`);
    console.log(`Client ${client.id} joined workspace: ${workspaceId}`);
    return { event: 'joinedWorkspace', data: workspaceId };
  }

  @SubscribeMessage('leaveWorkspace')
  handleLeaveWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() workspaceId: string,
  ) {
    client.leave(`workspace:${workspaceId}`);
    return { event: 'leftWorkspace', data: workspaceId };
  }

  emitTaskCreated(workspaceId: string, task: any) {
    this.server.to(`workspace:${workspaceId}`).emit('taskCreated', task);
  }

  emitTaskUpdated(workspaceId: string, task: any) {
    this.server.to(`workspace:${workspaceId}`).emit('taskUpdated', task);
  }

  emitTaskMoved(workspaceId: string, task: any) {
    this.server.to(`workspace:${workspaceId}`).emit('taskMoved', task);
  }

  emitTaskDeleted(workspaceId: string, taskId: string) {
    this.server.to(`workspace:${workspaceId}`).emit('taskDeleted', taskId);
  }

  emitNotification(workspaceId: string, notification: any) {
    this.server.to(`workspace:${workspaceId}`).emit('notification', notification);
  }
}
