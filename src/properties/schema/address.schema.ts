import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Address {
  @Prop({ required: true })
  address: string;
  @Prop()
  city?: string;
  @Prop()
  postalCode?: string;
  @Prop()
  country?: string;
}
