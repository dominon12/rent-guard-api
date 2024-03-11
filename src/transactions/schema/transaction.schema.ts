import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Property } from 'src/properties/schema/property.schema';
import { TransactionType } from '../types/transaction-type.enum';

@Schema({ timestamps: true })
export class Transaction {
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Property',
    required: true,
  })
  property: Property;
  @Prop({ type: String, enum: TransactionType, required: true })
  type: TransactionType;
  @Prop({ required: true })
  amount: number;
  @Prop()
  description?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
