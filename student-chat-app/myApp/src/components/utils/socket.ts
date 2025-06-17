import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (token: string, chatId: string) => {
    console.log('Connecting socket with:', { token, chatId });
  socket = io('https://ratechat-f72a4557d4ab.herokuapp.com', {
      transports: ['websocket'], 
    auth: {
      token,
    chatId,  
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
