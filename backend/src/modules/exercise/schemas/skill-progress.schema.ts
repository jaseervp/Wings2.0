import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type SkillProgressDocument = SkillProgress & Document;

@Schema({ timestamps: true })
export class SkillProgress {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Child', required: true, index: true })
  childId: Types.ObjectId | string;

  @Prop({ required: true, trim: true, index: true })
  skillArea: string; // 'Fine Motor', 'Gross Motor', 'Balance', 'Attention', 'Communication', 'Visual Tracking', etc.

  @Prop({ required: true, type: Number, min: 0, max: 100 })
  score: number;

  @Prop({ default: 100 })
  fullMark: number;

  @Prop({ default: 'PERCENTAGE' })
  scoreType: string;

  @Prop({ default: 'ASSESSMENT' })
  source: string; // 'ASSESSMENT', 'THERAPIST_EVALUATION', 'ACTIVITY_PERFORMANCE'

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  recordedBy?: Types.ObjectId | string;

  @Prop({ default: () => new Date() })
  recordedAt: Date;
}

export const SkillProgressSchema = SchemaFactory.createForClass(SkillProgress);
SkillProgressSchema.index({ childId: 1, skillArea: 1 });
