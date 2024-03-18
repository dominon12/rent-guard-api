import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Contract } from 'src/contracts/schema/contract.schema';
import { InvoiceType } from '../types/invoice-type.enum';

@Schema({ timestamps: true })
export class Invoice {
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Contract',
    required: true,
  })
  contract: Contract;
  @Prop({ required: true, type: String, enum: InvoiceType })
  type: InvoiceType;
  @Prop({ required: true })
  amount: number;
  @Prop({ default: false })
  wasPaid: boolean;
  @Prop({ required: true })
  dueDate: Date;
  @Prop()
  description?: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
