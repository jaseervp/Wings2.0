import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type TherapistFeedbackDocument = TherapistFeedback & Document;

@Schema({ timestamps: true })
export class TherapistFeedback {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Child', required: true, index: true })
  childId: Types.ObjectId | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', index: true })
  therapistId?: Types.ObjectId | string;

  @Prop({ required: true, trim: true })
  therapistName: string;

  @Prop({ required: true, trim: true, default: 'Occupational Therapist' })
  therapistRole: string;

  @Prop({ trim: true, default: '' })
  therapistAvatar: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ChildActivityPlan' })
  relatedActivityPlanId?: Types.ObjectId | string;

  @Prop({ required: true, trim: true })
  feedback: string;

  @Prop({ type: Date })
  nextReviewDate?: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const TherapistFeedbackSchema = SchemaFactory.createForClass(TherapistFeedback);
TherapistFeedbackSchema.index({ childId: 1, createdAt: -1 });
