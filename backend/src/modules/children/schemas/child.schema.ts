import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ChildDocument = Child & Document;

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

@Schema({ timestamps: true })
export class Child {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  parentId: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ trim: true })
  preferredName: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ type: String, enum: Gender, required: true })
  gender: Gender;

  @Prop()
  profilePhoto: string;

  @Prop()
  bloodGroup: string;

  // Birth Information
  @Prop()
  birthType: string;

  @Prop()
  prematureBirth: string;

  @Prop()
  pregnancyComplications: string;

  @Prop()
  nicuAdmission: string;

  @Prop({ type: Number })
  birthWeight: number;

  // Medical Information
  @Prop()
  medicalConditions: string;

  @Prop()
  allergies: string;

  @Prop()
  medications: string;

  // Developmental Information
  @Prop()
  motorSkillsDelays: string;

  @Prop()
  speechLanguageDelays: string;

  @Prop()
  socialInteractionConcerns: string;

  @Prop()
  primaryConcerns: string;

  @Prop()
  hasPriorAssessments: string;

  @Prop({ default: 'ACTIVE' })
  status: string;

  // Clinical / Assessment summaries
  @Prop({ trim: true, default: 'PENDING' })
  diagnosis: string;

  @Prop({ trim: true, default: null })
  iqBand: string;

  @Prop({ default: null })
  lastExamDate: Date;
}

export const ChildSchema = SchemaFactory.createForClass(Child);

ChildSchema.index({ createdAt: -1 });
ChildSchema.index({ firstName: 1, lastName: 1 });
ChildSchema.index({ gender: 1 });
ChildSchema.index({ dateOfBirth: 1 });
ChildSchema.index({ diagnosis: 1 });
ChildSchema.index({ iqBand: 1 });
