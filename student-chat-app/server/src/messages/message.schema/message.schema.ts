import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  sender: string;
@Prop()
text: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  CHAT_ID: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: false, default: 0 })
  score: number;


  @Prop({ required: false })
  mood: string;

  @Prop({ required: false })
  userId: string;

  @Prop({ required: false })
  content: string;


 
}

export const MessageSchema = SchemaFactory.createForClass(Message);
