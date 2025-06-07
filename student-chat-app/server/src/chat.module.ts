// chat.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MessagesModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,  
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
