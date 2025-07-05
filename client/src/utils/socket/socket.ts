import { io, Socket } from "socket.io-client";
import { initializeEvents } from './events';
const ServerURL = 'http://localhost:4000';



export const socket: Socket = io(ServerURL, {
  autoConnect: true,
  transports: ['websocket'],
})

export const events = initializeEvents(socket);

socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});