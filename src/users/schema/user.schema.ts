import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Role } from '../types/role.enum';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true, enum: Role })
  role: Role;
  @Prop()
  govId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
