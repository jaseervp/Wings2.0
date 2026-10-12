import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type OnboardingSessionDocument = OnboardingSession & Document;

export enum OnboardingStep {
  PARENT_INFORMATION = 'PARENT_INFORMATION',
  CHILD_INFORMATION = 'CHILD_INFORMATION',
  BIRTH_INFORMATION = 'BIRTH_INFORMATION',
  DEVELOPMENTAL_INFORMATION = 'DEVELOPMENTAL_INFORMATION',
  PRELIMINARY_ASSESSMENT = 'PRELIMINARY_ASSESSMENT',
  REVIEW = 'REVIEW',
}

@Schema({ timestamps: true })
export class OnboardingSession {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  parentId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Child' })
  childId: string;

  @Prop({ type: Number, default: 0 })
  stepIndex: number;

  @Prop({ type: String, enum: OnboardingStep, default: OnboardingStep.PARENT_INFORMATION })
  currentStep: OnboardingStep;

  @Prop({ type: [String], default: [] })
  completedSteps: string[];

  @Prop({ type: String, enum: ['IN_PROGRESS', 'COMPLETED'], default: 'IN_PROGRESS' })
  status: string;

  // Saved in-progress assessment responses
  @Prop({ type: Object, default: {} })
  assessmentResponses: Record<string, string>;

  @Prop({ default: () => new Date() })
  startedAt: Date;

  @Prop({ default: () => new Date() })
  lastSavedAt: Date;

  @Prop()
  completedAt: Date;
}

export const OnboardingSessionSchema = SchemaFactory.createForClass(OnboardingSession);
