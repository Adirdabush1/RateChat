import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(messageDto: Partial<Message>): Promise<Message> {
    const createdMessage = new this.messageModel(messageDto);
    return createdMessage.save();
  }

  async saveMessage(sender: string, message: string, CHAT_ID: string, score: number) {
    const messageObj = {
      sender,
      message,
      CHAT_ID,
      score,
      timestamp: new Date(),
    };
    return this.create(messageObj);
  }

  async getMessagesByChat(CHAT_ID: string): Promise<Message[]> {
    return this.messageModel.find({ CHAT_ID }).exec();
  }
}
