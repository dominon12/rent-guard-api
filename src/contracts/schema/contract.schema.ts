import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { User } from 'src/users/schema/user.schema';
import { Property } from 'src/properties/schema/property.schema';

@Schema({ timestamps: true })
export class Contract {
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Property',
    required: true,
  })
  property: Property;
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  tenant: User;
  @Prop({ required: true })
  from: Date;
  @Prop({ required: true })
  until: Date;
  @Prop({ required: true })
  rent: number;
  @Prop({ type: [String], required: true })
  documents: string[];
  @Prop()
  deposit?: number;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
