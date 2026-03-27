import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (!socket) {
    socket = io(`${SOCKET_URL}/ws`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('🔌 WebSocket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;

export const joinWorkspace = (workspaceId: string) => {
  socket?.emit('joinWorkspace', workspaceId);
};

export const leaveWorkspace = (workspaceId: string) => {
  socket?.emit('leaveWorkspace', workspaceId);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
