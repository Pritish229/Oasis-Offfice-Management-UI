// src/socketManager.js
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket'], 
});

// Emit event
export const emitSocket = (event, data, ackCallback) => {
  socket.emit(event, data, ackCallback);
};

// Listen to event
export const onSocket = (event, callback) => {
  socket.on(event, callback);
};

// Stop listening to event
export const offSocket = (event) => {
  socket.off(event);
};

// Connect/disconnect (optional)
export const connectSocket = () => socket.connect();
export const disconnectSocket = () => socket.disconnect();

export default socket;
