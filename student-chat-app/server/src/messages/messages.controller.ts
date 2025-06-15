import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':chatId')
  async getMessages(@Param('chatId') chatId: string) {
    return this.messagesService.getMessagesByChat(chatId);
  }

  @Post()
  async createMessage(@Body() body: { chatId: string; sender: string; message: string }) {
    return this.messagesService.saveMessage(
      body.sender,
      body.message,
      body.chatId,
      0
    );
  }
}
