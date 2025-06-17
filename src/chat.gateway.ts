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
    origin: 'https://ratechat-f72a4557d4ab.herokuapp.com',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  // מפה לשמירת סוקט של ההורים לפי מייל תלמיד
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
      // מקבל טוקן וקבוצה מהחיבור
      const token = client.handshake.auth.token;
      const chatId = client.handshake.auth.chatId as string;

      this.logger.log(`handleConnection - received token: ${token}`);
      this.logger.log(`handleConnection - received chatId: ${chatId}`);

      if (!token || !chatId) {
        this.logger.warn('Missing token or chatId in handshake auth');
        client.disconnect();
        return;
      }

      // אימות הטוקן
      // const payload = this.jwtService.verify(token);
const payload = { email: token || 'test@example.com' };

      client.data.user = payload;  // שומר פרטי המשתמש בסוקט
      client.data.chatId = chatId;

      // הצטרפות לחדר
      client.join(chatId);

      this.logger.log(`Client connected: ${payload.email} to chat ${chatId}`);

      // שליחת היסטוריית ההודעות ללקוח
      const history = await this.messagesService.getMessagesByChat(chatId);
      client.emit('chat_history', history);

      // הודעת מערכת על הצטרפות משתמש
      this.server.to(chatId).emit('receive_message', {
        sender: 'System',
        message: `wallcome to  ${chatId}`,
      });
    } catch (err: any) {
      this.logger.error('Invalid token or error during connection:', err.message);
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
    });
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room ${room}`);
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.leave(room);
    this.logger.log(`Client ${client.id} left room ${room}`);
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
      // ניתוח ההודעה ע"י AI
      const analysis: AIAnalysis = await analyzeMessageEnglish(data.message);

      if (analysis.toxic) {
        this.logger.warn('Toxic message detected:', analysis.reason);
        if (analysis.alertParent) {
          // כאן ניתן להוסיף טיפול מיוחד במקרה הצורך
        }
      }

      const score = typeof analysis.score === 'number' ? analysis.score : 0;
      const scoreChange = typeof analysis.scoreChange === 'number' ? analysis.scoreChange : 0;

      // דגל הודעה מסוכנת אם הציון נמוך מ-50
      const flagged = score < 50;

      // שמירת ההודעה בבסיס הנתונים
      const saved = await this.messagesService.saveMessage(
        user.email,
        data.message,
        chatId,
        score,
        flagged,
      );

      // שידור ההודעה לכל מי שבחדר
      this.server.to(chatId).emit('receive_message', {
        sender: saved.sender,
        message: saved.message,
        score,
        flagged,
        chatId,
      });

      if (analysis.alertParent) {
        this.logger.warn(`Alert for parent! Reason: ${analysis.reason}`);

        // שליחת התראה ל-API חיצוני (אם יש)
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

        // עדכון בזמן אמת להורה אם מחובר
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

      // עדכון ניקוד משתמש
      await this.usersService.updateUserScore(user.email, scoreChange);
    } catch (err: any) {
      this.logger.error('Error in onSendMessage:', err);
    }
  }
}
