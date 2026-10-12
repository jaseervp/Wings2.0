import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { Gender } from '../schemas/child.schema';

export class CreateChildDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  preferredName?: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsOptional()
  profilePhoto?: string;

  @IsString()
  @IsOptional()
  bloodGroup?: string;

  // Birth Information
  @IsString()
  @IsOptional()
  birthType?: string;

  @IsString()
  @IsOptional()
  prematureBirth?: string;

  @IsString()
  @IsOptional()
  pregnancyComplications?: string;

  @IsString()
  @IsOptional()
  nicuAdmission?: string;

  @IsNumber()
  @Min(0)
  @Max(25)
  @IsOptional()
  birthWeight?: number;

  // Medical Information
  @IsString()
  @IsOptional()
  medicalConditions?: string;

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsOptional()
  medications?: string;

  // Developmental Information
  @IsString()
  @IsOptional()
  motorSkillsDelays?: string;

  @IsString()
  @IsOptional()
  speechLanguageDelays?: string;

  @IsString()
  @IsOptional()
  socialInteractionConcerns?: string;

  @IsString()
  @IsOptional()
  primaryConcerns?: string;

  @IsString()
  @IsOptional()
  hasPriorAssessments?: string;
}

export class UpdateChildDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  preferredName?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  profilePhoto?: string;

  @IsString()
  @IsOptional()
  bloodGroup?: string;

  // Birth Information
  @IsString()
  @IsOptional()
  birthType?: string;

  @IsString()
  @IsOptional()
  prematureBirth?: string;

  @IsString()
  @IsOptional()
  pregnancyComplications?: string;

  @IsString()
  @IsOptional()
  nicuAdmission?: string;

  @IsNumber()
  @Min(0)
  @Max(25)
  @IsOptional()
  birthWeight?: number;

  // Medical Information
  @IsString()
  @IsOptional()
  medicalConditions?: string;

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsOptional()
  medications?: string;

  // Developmental Information
  @IsString()
  @IsOptional()
  motorSkillsDelays?: string;

  @IsString()
  @IsOptional()
  speechLanguageDelays?: string;

  @IsString()
  @IsOptional()
  socialInteractionConcerns?: string;

  @IsString()
  @IsOptional()
  primaryConcerns?: string;

  @IsString()
  @IsOptional()
  hasPriorAssessments?: string;
}
