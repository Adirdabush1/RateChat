import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  chatId: string;

  @Prop({ default: 0 })
  score: number;

  @Prop()
  mood?: string;

  @Prop()
  userId?: string;

@Prop({ default: false })
flagged?: boolean;

}

export const MessageSchema = SchemaFactory.createForClass(Message);
