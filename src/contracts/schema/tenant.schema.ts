import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Tenant {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop()
  govId?: string;
}
