import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ChildActivityPlanDocument = ChildActivityPlan & Document;

export enum AssignmentSource {
  MANUAL = 'MANUAL',
  AUTOMATIC_RULE = 'AUTOMATIC_RULE',
  THERAPIST = 'THERAPIST',
}

export enum ActivityPlanStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
}

@Schema({ timestamps: true })
export class ChildActivityPlan {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Child', required: true, index: true })
  childId: Types.ObjectId | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Exercise', required: true, index: true })
  exerciseId: Types.ObjectId | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  assignedBy: Types.ObjectId | string;

  @Prop({
    type: String,
    enum: Object.values(AssignmentSource),
    default: AssignmentSource.MANUAL,
  })
  assignmentSource: AssignmentSource;

  @Prop({ required: true, type: String, index: true })
  scheduledDate: string; // YYYY-MM-DD

  @Prop({ type: String, default: '09:00 AM' })
  scheduledTime: string;

  @Prop({ type: Number, default: 0 })
  order: number;

  @Prop({
    type: String,
    enum: Object.values(ActivityPlanStatus),
    default: ActivityPlanStatus.PENDING,
    index: true,
  })
  status: ActivityPlanStatus;

  @Prop({ type: Boolean, default: true })
  therapistApproved: boolean;

  @Prop({ type: String, default: '' })
  notes: string;
}

export const ChildActivityPlanSchema = SchemaFactory.createForClass(ChildActivityPlan);

ChildActivityPlanSchema.index({ childId: 1, scheduledDate: 1, status: 1 });
ChildActivityPlanSchema.index({ childId: 1, exerciseId: 1, scheduledDate: 1 }, { unique: true });
