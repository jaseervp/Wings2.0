import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AssessmentResponseDocument = AssessmentResponse & Document;

@Schema({ timestamps: true })
export class AssessmentResponse {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  parentId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Child', required: true, index: true })
  childId: string;

  @Prop({ required: true, default: 'PRELIMINARY' })
  type: string;

  @Prop({ type: Object, required: true })
  responses: Record<string, string>;

  @Prop({ type: String, enum: ['DRAFT', 'COMPLETED'], default: 'COMPLETED' })
  status: string;

  @Prop({ default: '1.0' })
  version: string;

  @Prop({ default: () => new Date() })
  completedAt: Date;
}

export const AssessmentResponseSchema = SchemaFactory.createForClass(AssessmentResponse);
