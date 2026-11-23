import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ExerciseAssignmentRuleDocument = ExerciseAssignmentRule & Document;

@Schema({ _id: false })
export class AssignmentCriteria {
  @Prop({ type: Number })
  minAge?: number;

  @Prop({ type: Number })
  maxAge?: number;

  @Prop({ type: [String], default: [] })
  categories?: string[];

  @Prop({ type: [String], default: [] })
  skillAreas?: string[];

  @Prop({ type: [String], default: [] })
  diagnoses?: string[];

  @Prop({ type: [String], default: [] })
  primaryConcerns?: string[];

  @Prop({ type: Number, default: 4 })
  dailyTarget?: number;
}

@Schema({ timestamps: true })
export class ExerciseAssignmentRule {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({ default: true })
  enabled: boolean;

  @Prop({ type: AssignmentCriteria, default: () => ({}) })
  criteria: AssignmentCriteria;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Exercise' }], default: [] })
  exerciseIds: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: string;
}

export const ExerciseAssignmentRuleSchema = SchemaFactory.createForClass(ExerciseAssignmentRule);
ExerciseAssignmentRuleSchema.index({ enabled: 1 });
