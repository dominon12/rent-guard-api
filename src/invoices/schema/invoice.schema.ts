import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Contract } from 'src/contracts/schema/contract.schema';

@Schema({ timestamps: true })
export class Invoice {
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Contract',
    required: true,
  })
  contract: Contract;
  @Prop({ required: true })
  amount: number;
  @Prop({ default: false })
  wasPaid: boolean;
  @Prop({ required: true })
  dueDate: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
