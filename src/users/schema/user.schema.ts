import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Role } from '../types/role.enum';
import mongoose, { ObjectId } from 'mongoose';

@Schema()
export class User {
  @Prop({ type: mongoose.Types.ObjectId })
  _id: ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, enum: Role })
  role: Role;
  @Prop()
  govId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
