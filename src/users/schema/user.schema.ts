import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { Role } from '../types/role.enum';

@Schema({ timestamps: true })
export class User {
  _id: mongoose.Types.ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ type: String, enum: Role, required: true })
  role: Role;
  @Prop()
  govId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
