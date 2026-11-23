import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExerciseCategoryDocument = ExerciseCategory & Document;

@Schema({ timestamps: true })
export class ExerciseCategory {
  @Prop({ required: true, trim: true, unique: true })
  name: string;

  @Prop({ required: true, trim: true, unique: true })
  slug: string;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({ default: 'text-primary' })
  color: string;

  @Prop({ default: 'bg-primary/10' })
  bg: string;

  @Prop({ default: 'Activity' })
  icon: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ExerciseCategorySchema = SchemaFactory.createForClass(ExerciseCategory);
ExerciseCategorySchema.index({ slug: 1 });
ExerciseCategorySchema.index({ isActive: 1, order: 1 });
