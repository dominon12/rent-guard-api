import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from 'src/users/schema/user.schema';

@Schema({ timestamps: true })
export class Property {
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  owner: User;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  address: string;
  @Prop({ type: [String], required: true })
  images: string[];
  @Prop({ type: [String], required: true })
  documents: string[];
  @Prop()
  city?: string;
  @Prop()
  postalCode?: string;
  @Prop()
  country?: string;
  @Prop()
  registrationId?: string;
  @Prop()
  surface?: string;
  @Prop()
  price?: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
