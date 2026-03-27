import { useEffect, useRef, useCallback } from 'react';
import { connectSocket, joinWorkspace, leaveWorkspace, disconnectSocket } from '../services/socket';
import { Socket } from 'socket.io-client';

export const useSocket = (workspaceId: string | null) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = connectSocket();

    if (workspaceId) {
      joinWorkspace(workspaceId);
    }

    return () => {
      if (workspaceId) {
        leaveWorkspace(workspaceId);
      }
    };
  }, [workspaceId]);

  const onEvent = useCallback((event: string, handler: (data: any) => void) => {
    socketRef.current?.on(event, handler);
    return () => {
      socketRef.current?.off(event, handler);
    };
  }, []);

  return { socket: socketRef.current, onEvent };
};
