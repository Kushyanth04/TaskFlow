import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Board extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  workspaceId: string;

  @Prop({
    type: [String],
    default: ['To Do', 'In Progress', 'Done'],
  })
  columns: string[];

  @Prop({ type: [String], default: [] })
  members: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
