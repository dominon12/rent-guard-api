import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { Property } from 'src/properties/schema/property.schema';
import { Tenant } from './tenant.schema';
import { Document } from 'src/documents/schema/document.schema';

@Schema({ timestamps: true })
export class Contract {
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Property',
    required: true,
  })
  property: Property;
  @Prop({ type: Tenant, required: true })
  tenant: Tenant;
  @Prop({ required: true })
  from: Date;
  @Prop({ required: true })
  until: Date;
  @Prop({ required: true })
  rent: number;
  @Prop({ type: [Document], required: true })
  documents: Document[];
  @Prop()
  deposit?: number;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
