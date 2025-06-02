// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AlertsService } from './alerts/alerts.service';
import { ChatGateway } from './chat.gateway';
import { ParentModule } from './perent/parent.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost:27017/ratechat'),
    AuthModule,
    UsersModule,
    MessagesModule,
    ParentModule,
  ],
  providers: [ChatGateway, AlertsService],
})
export class AppModule {}
