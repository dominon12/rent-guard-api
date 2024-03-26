import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  url: string;
}
