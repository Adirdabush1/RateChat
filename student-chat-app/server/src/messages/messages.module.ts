import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesService } from './messages.service';
import { Message, MessageSchema } from './message.schema/message.schema';
import { UsersModule } from '../users/users.module';
import { AlertsModule } from '../alerts/alerts.module'; // הוספת הייבוא כאן

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UsersModule,
    AlertsModule,  // הוספה
  ],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
