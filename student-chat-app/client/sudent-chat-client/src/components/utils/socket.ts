import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (token: string, CHAT_ID: string) => {
    console.log('Connecting socket with:', { token, CHAT_ID });
  socket = io('http://localhost:3000', {
    auth: {
      token,
    CHAT_ID,  
    },
  });

  return socket;
};


export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
