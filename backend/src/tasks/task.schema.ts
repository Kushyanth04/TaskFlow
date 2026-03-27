import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({ default: null })
  assignee: string;

  @Prop({ default: null })
  assigneeName: string;

  @Prop({ type: String, enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Prop({ default: null })
  dueDate: Date;

  @Prop({ default: null })
  startedAt: Date;

  @Prop({ default: null })
  timeTakenSeconds: number;

  @Prop({ required: true })
  boardId: string;

  @Prop({ required: true })
  workspaceId: string;

  @Prop()
  createdBy: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
