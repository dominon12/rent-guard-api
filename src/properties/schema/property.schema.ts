import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from 'src/users/schema/user.schema';
import { Address } from './address.schema';
import { Document } from 'src/documents/schema/document.schema';

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
  @Prop({ type: [String], required: true })
  images: string[];
  @Prop({ type: Address, required: true })
  address: Address;
  @Prop({ type: [Document], required: true })
  documents: Document[];
  @Prop()
  registrationId?: string;
  @Prop()
  surface?: string;
  @Prop()
  price?: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
