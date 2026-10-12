import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OtpVerificationDocument = OtpVerification & Document;

export enum OtpChannel {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export enum OtpPurpose {
  SIGNUP = 'SIGNUP',
  LOGIN = 'LOGIN',
  PASSWORD_RESET = 'PASSWORD_RESET',
  PHONE_VERIFICATION = 'PHONE_VERIFICATION',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
}

@Schema({ timestamps: true })
export class OtpVerification {
  @Prop({ required: true, unique: true })
  verificationId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: String, enum: OtpChannel, required: true })
  channel: OtpChannel;

  @Prop({ type: String, enum: OtpPurpose, required: true })
  purpose: OtpPurpose;

  @Prop({ required: true })
  otpHash: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: 0 })
  attempts: number;

  @Prop({ default: 5 })
  maxAttempts: number;

  @Prop({ default: 0 })
  resendCount: number;

  @Prop()
  lastSentAt: Date;

  @Prop()
  verifiedAt: Date;
}

export const OtpVerificationSchema = SchemaFactory.createForClass(OtpVerification);

// TTL index to automatically delete expired documents
OtpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
