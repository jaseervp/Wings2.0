import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ActivityLogDocument = ActivityLog & Document;

export enum CompletionStatus {
  COMPLETED = 'COMPLETED',
  PARTIAL = 'PARTIAL',
  REVERTED = 'REVERTED',
}

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Child', required: true, index: true })
  childId: Types.ObjectId | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ChildActivityPlan', required: true, index: true })
  activityPlanId: Types.ObjectId | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Exercise', required: true, index: true })
  exerciseId: Types.ObjectId | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  completedBy: Types.ObjectId | string;

  @Prop({ required: true, type: String, index: true })
  completedDate: string; // YYYY-MM-DD format for local date calculations

  @Prop({ type: Date, default: () => new Date() })
  completedAt: Date;

  @Prop({ type: Number, default: 0 })
  durationCompleted: number; // in minutes

  @Prop({
    type: String,
    enum: Object.values(CompletionStatus),
    default: CompletionStatus.COMPLETED,
  })
  completionStatus: CompletionStatus;

  @Prop({ type: String, default: '' })
  notes: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

ActivityLogSchema.index({ childId: 1, activityPlanId: 1 }, { unique: true });
ActivityLogSchema.index({ childId: 1, completedDate: 1 });
