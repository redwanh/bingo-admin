import { useEffect } from 'react';
import socketService from '../services/socketService';

export function useSocket(token, callbacks = {}) {
  useEffect(() => {
    if (!token) return;

    // Connect socket
    socketService.connect(token);

    // Register listeners
    Object.entries(callbacks).forEach(([event, callback]) => {
      socketService.on(event, callback);
    });

    // Cleanup on unmount
    return () => {
      Object.entries(callbacks).forEach(([event, callback]) => {
        socketService.off(event, callback);
      });
    };
  }, [token]);
}