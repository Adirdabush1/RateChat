import { Controller, Get, Post, Delete,Body,Param } from '@nestjs/common';
import { MessagesService } from './messages.service';


@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}


@Get(':CHAT_ID')
async getMessages(@Param('CHAT_ID') CHAT_ID: string) {
  return this.messagesService.getMessagesByChat(CHAT_ID);
}

  @Post()
async createMessage(@Body() body: { CHAT_ID: string; sender: string; message: string }) {
  return this.messagesService.saveMessage(
    body.sender,
    body.message,
    body.CHAT_ID,
    0
  );
}


}
