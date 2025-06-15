import { Schema, Document } from 'mongoose';

export interface Parent extends Document {
  name: string;
  email: string;
  password: string;
  childEmail: string;
}

export const ParentSchema = new Schema<Parent>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  childEmail: { type: String, required: true },
});
