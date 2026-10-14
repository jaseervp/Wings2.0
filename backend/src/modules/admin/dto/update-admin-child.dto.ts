import { IsString, IsOptional, MinLength, MaxLength, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { Gender } from '../../children/schemas/child.schema';

export class UpdateAdminChildDto {
  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  preferredName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  iqBand?: string;

  @IsOptional()
  @IsString()
  birthType?: string;

  @IsOptional()
  @IsNumber()
  birthWeight?: number;

  @IsOptional()
  @IsString()
  medicalConditions?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  medications?: string;

  @IsOptional()
  @IsString()
  primaryConcerns?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
