import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Role } from '../types/role.enum';
import mongoose, { ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: mongoose.Types.ObjectId })
  _id: ObjectId;
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
