import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { analyzeMessageEnglish } from './service/analyzeMessage';
import { MessagesService } from './messages/messages.service';
import { UsersService } from './users/users.service';

@WebSocketGateway({
 cors: {
  origin: [
    'http://localhost:5173',
    'https://ratechat-1.onrender.com',
    'https://ratechat2.onrender.com',
  ],
  methods: ['GET', 'POST'],
  credentials: true,
},

})
export class ChatGateway {
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
      const CHAT_ID = client.handshake.auth.CHAT_ID;

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
        sender: 'System',
        message: `${payload.email} joined chat ${CHAT_ID}`,
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

    if (this.parentSockets.has(email)) {
      this.parentSockets.delete(email);
      this.logger.log(`Removed parent socket for ${email}`);
    }

    this.server.to(CHAT_ID).emit('receive_message', {
      sender: 'System',
      message: `${email} disconnected from chat`,
      CHAT_ID,
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
    const CHAT_ID = client.data.CHAT_ID;

    if (!user || !CHAT_ID) {
      this.logger.warn('Unauthorized user or missing CHAT_ID tried to send message');
      return;
    }

    try {
      const analysis = await analyzeMessageEnglish(data.message);

      if (analysis.toxic) {
        this.logger.warn('Toxic message detected:', analysis.reason);
        if (analysis.alertParent) {
          // אפשרות לשליחת הודעה להורה אם צריך
        }
      }

      const score = typeof analysis.score === 'number' ? analysis.score : 0;
      const scoreChange = typeof analysis.scoreChange === 'number' ? analysis.scoreChange : 0;

      const saved = await this.messagesService.saveMessage(user.email, data.message, CHAT_ID, score);

      this.server.to(CHAT_ID).emit('receive_message', {
        sender: saved.sender,
        message: saved.message,
        score,
        CHAT_ID,
      });

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
    } catch (err) {
      this.logger.error('Error in onSendMessage:', err);
    }
  }
}
