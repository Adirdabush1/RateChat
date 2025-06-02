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

import { analyzeMessage } from './service/analyzeMessage';
import { MessagesService } from './messages/messages.service';
import { UsersService } from './users/users.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

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
      const CHAT_ID = client.handshake.auth.CHAT_ID as string;

      this.logger.log(`handleConnection - received token: ${token}`);
      this.logger.log(`handleConnection - received CHAT_ID: ${CHAT_ID}`);

      const payload = this.jwtService.verify(token);

      client.data.user = payload;
      client.data.CHAT_ID = CHAT_ID;

      client.join(CHAT_ID);

      this.logger.log(`Client connected: ${payload.email} to chat ${CHAT_ID}`);

      const history = await this.messagesService.getMessagesByChat(CHAT_ID);
      client.emit('chat_history', history);

      this.server.to(CHAT_ID).emit('receive_message', {
        sender: 'מערכת',
        message: `${payload.email} הצטרף לצ'אט ${CHAT_ID}`,
      });

    } catch (err) {
      this.logger.error('Invalid token', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const email = client.data.user?.email || client.id;
    const CHAT_ID = client.data.CHAT_ID || 'unknown chat';
    this.logger.log(`Client disconnected: ${email} from chat ${CHAT_ID}`);

    this.server.to(CHAT_ID).emit('receive_message', {
      sender: 'מערכת',
      message: `${email} התנתק מהצ'אט`,
      CHAT_ID,
    });
  }

  @SubscribeMessage('send_message')
  async onSendMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    const CHAT_ID = client.data.CHAT_ID;

    if (!user || !CHAT_ID) {
      this.logger.warn('Unauthorized user or missing CHAT_ID tried to send message');
      return;
    }

    try {
      const analysis = await analyzeMessage(data.message);

      // אפשרות ב - שמירה במסד
      const saved = await this.messagesService.saveMessage(
        user.email,
        data.message,
        CHAT_ID,
        analysis.score
      );

      this.server.to(CHAT_ID).emit('receive_message', {
        sender: saved.sender,
        message: saved.message,
        score: analysis.score,
        CHAT_ID,
      });

      // אפשרות א - שליחת התראה חיצונית
      if (analysis.alertParent) {
        this.logger.warn(`Alert for parent! Reason: ${analysis.reason}`);
        try {
          await axios.post('https://your-api-url.com/alert', {
            studentEmail: user.email,
            message: data.message,
            chatId: CHAT_ID,
            reason: analysis.reason,
            timestamp: new Date().toISOString(),
          });
          this.logger.log(`Alert sent to parent for ${user.email}`);
        } catch (error) {
          this.logger.error('Failed to send alert to parent:', error.message);
        }
      }

      await this.usersService.updateUserScore(user.email, analysis.scoreChange);

    } catch (err) {
      this.logger.error('Error in onSendMessage:', err);
    }
  }
}
