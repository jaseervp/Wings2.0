import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { ExerciseDifficulty, AgeUnit } from './exercise.schema';

export type ExerciseProgramTemplateDocument = ExerciseProgramTemplate & Document;

@Schema({ _id: false })
export class TemplateDayRoutine {
  @Prop({ required: true, type: Number })
  dayNumber: number; // 1 to 30

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Exercise' }], default: [] })
  exerciseIds: Types.ObjectId[];

  @Prop({ default: 'Focus on consistent engagement and steady breathing.' })
  notes: string;
}

@Schema({ timestamps: true })
export class ExerciseProgramTemplate {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, type: Number, default: 7 })
  durationDays: number; // 7, 14, 21, 30

  @Prop({ required: true, trim: true, default: 'Sensory' })
  category: string;

  @Prop({
    type: String,
    enum: Object.values(ExerciseDifficulty),
    default: ExerciseDifficulty.EASY,
  })
  difficulty: ExerciseDifficulty;

  @Prop({ type: Number, default: 3 })
  minAge: number;

  @Prop({ type: Number, default: 12 })
  maxAge: number;

  @Prop({
    type: String,
    enum: Object.values(AgeUnit),
    default: AgeUnit.YEARS,
  })
  ageUnit: AgeUnit;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Exercise' }], default: [] })
  exerciseIds: Types.ObjectId[];

  @Prop({ type: [TemplateDayRoutine], default: [] })
  dailyRoutines: TemplateDayRoutine[];

  @Prop({ default: 0 })
  assignedCount: number;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId | string;
}

export const ExerciseProgramTemplateSchema =
  SchemaFactory.createForClass(ExerciseProgramTemplate);

ExerciseProgramTemplateSchema.index({ category: 1, isPublished: 1 });
ExerciseProgramTemplateSchema.index({ durationDays: 1 });
