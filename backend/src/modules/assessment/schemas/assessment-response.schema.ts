import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AssessmentResponseDocument = AssessmentResponse & Document;

@Schema({ timestamps: true })
export class AssessmentResponse {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  parentId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Child', required: true, index: true })
  childId: string;

  @Prop({ type: String, trim: true, index: true })
  assessmentCode?: string;

  @Prop({ required: true, default: 'PRELIMINARY', index: true })
  type: string;

  @Prop({ type: Object, required: true })
  responses: Record<string, string>;

  @Prop({ 
    type: String, 
    enum: ['DRAFT', 'COMPLETED', 'NEEDS_REVIEW', 'REVIEWED', 'IN_PROGRESS'], 
    default: 'COMPLETED',
    index: true,
  })
  status: string;

  @Prop({ type: Boolean, default: false, index: true })
  flagged: boolean;

  @Prop({ type: String })
  flagReason?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  reviewedBy?: string;

  @Prop({ type: Date })
  reviewedAt?: Date;

  @Prop({ type: String })
  reviewNotes?: string;

  @Prop({ default: '1.0' })
  version: string;

  @Prop({ default: () => new Date(), index: true })
  completedAt: Date;
}

export const AssessmentResponseSchema = SchemaFactory.createForClass(AssessmentResponse);

AssessmentResponseSchema.index({ createdAt: -1 });
AssessmentResponseSchema.index({ status: 1, flagged: 1 });

