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

  async saveMessage(
    sender: string,
    message: string,
    chatId: string,
    score: number,
    flagged: boolean = false,
  ): Promise<Message> {
    const messageObj = {
      sender,
      message,
      chatId,
      score,
      flagged,
      createdAt: new Date(),
    };
    return this.create(messageObj);
  }

  async getMessagesByChat(chatId: string): Promise<Message[]> {
    return this.messageModel.find({ chatId }).exec();
  }

  async getFlaggedMessages(chatId: string): Promise<Message[]> {
    return this.messageModel.find({ chatId, flagged: true }).exec();
  }

  async getFlaggedMessagesByStudentEmail(studentEmail: string): Promise<Message[]> {
    return this.messageModel.find({ sender: studentEmail, flagged: true }).exec();
  }
}
