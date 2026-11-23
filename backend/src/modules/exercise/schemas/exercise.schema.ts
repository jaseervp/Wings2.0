import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ExerciseDocument = Exercise & Document;

export enum ExerciseDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum AgeUnit {
  MONTHS = 'MONTHS',
  YEARS = 'YEARS',
}

export enum ExerciseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum VideoProcessingStatus {
  PENDING_UPLOAD = 'PENDING_UPLOAD',
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  FAILED = 'FAILED',
}

@Schema({ _id: false })
export class ExerciseMedia {
  @Prop({ type: String })
  originalFilename: string;

  @Prop({ type: String })
  s3Key: string;

  @Prop({ type: String })
  processedKey: string;

  @Prop({ type: String })
  thumbnailKey: string;

  @Prop({ type: String })
  thumbnailUrl: string;

  @Prop({ type: String })
  mimeType: string;

  @Prop({ type: Number })
  fileSize: number;

  @Prop({ type: Number })
  processedFileSize: number;

  @Prop({ type: Number })
  durationSeconds: number;

  @Prop({ type: String })
  resolution: string;

  @Prop({
    type: String,
    enum: Object.values(VideoProcessingStatus),
    default: VideoProcessingStatus.PENDING_UPLOAD,
  })
  status: VideoProcessingStatus;

  @Prop({ type: String })
  errorMessage?: string;

  @Prop({ type: Date })
  uploadTimestamp?: Date;

  @Prop({ type: Date })
  processedTimestamp?: Date;
}

@Schema({ timestamps: true })
export class Exercise {
  @Prop({ required: true, trim: true, index: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: [String], default: [] })
  instructions: string[];

  @Prop({ required: true, trim: true, index: true })
  category: string;

  @Prop({ type: [String], default: [] })
  skillAreas: string[];

  @Prop({
    type: String,
    enum: Object.values(ExerciseDifficulty),
    default: ExerciseDifficulty.EASY,
    index: true,
  })
  difficulty: ExerciseDifficulty;

  @Prop({ required: true, type: Number, default: 5 })
  durationMinutes: number;

  @Prop({ type: Number, default: 2 })
  minAge: number;

  @Prop({ type: Number, default: 12 })
  maxAge: number;

  @Prop({
    type: String,
    enum: Object.values(AgeUnit),
    default: AgeUnit.YEARS,
  })
  ageUnit: AgeUnit;

  @Prop({ type: Boolean, default: false })
  recommended: boolean;

  @Prop({ type: String, default: 'text-primary' })
  color: string;

  @Prop({ type: String, default: 'bg-primary/10' })
  bg: string;

  @Prop({ type: ExerciseMedia, default: () => ({}) })
  media: ExerciseMedia;

  @Prop({
    type: String,
    enum: Object.values(ExerciseStatus),
    default: ExerciseStatus.PUBLISHED,
    index: true,
  })
  status: ExerciseStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: string;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);

ExerciseSchema.index({ category: 1, status: 1 });
ExerciseSchema.index({ minAge: 1, maxAge: 1, status: 1 });
ExerciseSchema.index({ title: 'text', description: 'text', category: 'text' });
