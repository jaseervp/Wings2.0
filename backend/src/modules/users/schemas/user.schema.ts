import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../../common/enums/role.enum';
import { OnboardingStatus } from '../../../common/enums/onboarding-status.enum';

export type UserDocument = User & Document;

export enum UserStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

export enum UserPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, unique: true, trim: true })
  phone: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.PARENT })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.PENDING_VERIFICATION })
  status: UserStatus;

  @Prop({ type: String, enum: UserPlan, default: UserPlan.FREE })
  plan: UserPlan;

  @Prop({ type: String, enum: OnboardingStatus, default: OnboardingStatus.NOT_STARTED })
  onboardingStatus: OnboardingStatus;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: false })
  phoneVerified: boolean;

  @Prop({ required: true })
  termsAccepted: boolean;

  @Prop()
  termsAcceptedAt: Date;

  @Prop({ default: false })
  marketingConsent: boolean;

  @Prop()
  lastLoginAt: Date;
  
  // refreshTokenHash if we want to store it in DB for extra security (optional depending on implementation)
  @Prop()
  refreshTokenHash: string;

  // Professional / Therapist profile fields
  @Prop({ trim: true, default: null })
  specialization: string;

  @Prop({ trim: true, default: null })
  availability: string;

  @Prop({ type: Number, default: null })
  rating: number;

  @Prop({ type: Number, default: null })
  reviewCount: number;

  @Prop({ type: Number, default: 0 })
  activePatientCount: number;

  @Prop({ trim: true, default: null })
  profilePhoto: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ createdAt: -1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ fullName: 1 });
UserSchema.index({ specialization: 1 });
