import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { OnModuleInit, Logger } from '@nestjs/common';

import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { analyzeMessageEnglish, AIAnalysis } from './service/analyzeMessage';

import { MessagesService } from './messages/messages.service';
import { UsersService } from './users/users.service';

@WebSocketGateway({
  cors: {
    origin: 
      'https://ratechat2.onrender.com',
    methods: ['GET', 'POST'], 
  },
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  private parentSockets = new Map<string, Socket>();

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    this.logger.log('ChatGateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const chatId = client.handshake.auth.chatId as string;

      this.logger.log(`handleConnection - received token: ${token}`);
      this.logger.log(`handleConnection - received chatId: ${chatId}`);

      const payload = this.jwtService.verify(token);

      client.data.user = payload;
      client.data.chatId = chatId;

      client.join(chatId);

      this.logger.log(`Client connected: ${payload.email} to chat ${chatId}`);

      const history = await this.messagesService.getMessagesByChat(chatId);
      client.emit('chat_history', history);

      this.server.to(chatId).emit('receive_message', {
        sender: 'System',
        message: `${payload.email} joined chat ${chatId}`,
      });
    } catch (err: any) {
      this.logger.error('Invalid token', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const email = client.data.user?.email || client.id;
    const chatId = client.data.chatId || 'unknown chat';
    this.logger.log(`Client disconnected: ${email} from chat ${chatId}`);

    if (this.parentSockets.has(email)) {
      this.parentSockets.delete(email);
      this.logger.log(`Removed parent socket for ${email}`);
    }

    this.server.to(chatId).emit('receive_message', {
      sender: 'System',
      message: `${email} disconnected from chat`,
      chatId,
    });
  }

  @SubscribeMessage('registerParent')
  handleRegisterParent(
    @MessageBody() parentEmail: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.parentSockets.set(parentEmail, client);
    this.logger.log(`Parent registered: ${parentEmail} with socket ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async onSendMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    const chatId = client.data.chatId;

    if (!user || !chatId) {
      this.logger.warn('Unauthorized user or missing chatId tried to send message');
      return;
    }

    try {
      const analysis: AIAnalysis = await analyzeMessageEnglish(data.message);

      if (analysis.toxic) {
        this.logger.warn('Toxic message detected:', analysis.reason);
        if (analysis.alertParent) {
          
        }
      }

      const score = typeof analysis.score === 'number' ? analysis.score : 0;
      const scoreChange = typeof analysis.scoreChange === 'number' ? analysis.scoreChange : 0;

      const saved = await this.messagesService.saveMessage(
        user.email,
        data.message,
        chatId,
        score,
      );

      this.server.to(chatId).emit('receive_message', {
        sender: saved.sender,
        message: saved.message,
        score,
        chatId,
      });

      if (analysis.alertParent) {
        this.logger.warn(`Alert for parent! Reason: ${analysis.reason}`);

        try {
          await axios.post('https://your-api-url.com/alert', {
            studentEmail: user.email,
            message: data.message,
            chatId: chatId,
            reason: analysis.reason,
            timestamp: new Date().toISOString(),
          });
          this.logger.log(`Alert sent to parent for ${user.email}`);
        } catch (error: any) {
          this.logger.error('Failed to send alert to parent:', error.message);
        }

        const parentSocket = this.parentSockets.get(user.email);
        if (parentSocket) {
          const currentScore = await this.usersService.updateUserScore(user.email, scoreChange);
          const flaggedMessages = await this.messagesService.getFlaggedMessages(user.email);

          parentSocket.emit('studentDataUpdate', {
            name: user.email,
            score: currentScore,
            flaggedMessages,
          });

          this.logger.log(`Real-time update sent to parent ${user.email}`);
        }
      }

      await this.usersService.updateUserScore(user.email, scoreChange);
    } catch (err: any) {
      this.logger.error('Error in onSendMessage:', err);
    }
  }
}
