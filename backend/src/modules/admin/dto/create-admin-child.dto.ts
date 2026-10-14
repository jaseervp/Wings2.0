import { IsString, IsNotEmpty, MinLength, MaxLength, IsEnum, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { Gender } from '../../children/schemas/child.schema';

export class CreateAdminChildDto {
  @IsString()
  @IsNotEmpty({ message: 'Parent ID is required' })
  parentId: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  preferredName?: string;

  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: string;

  @IsEnum(Gender, { message: 'Gender must be MALE, FEMALE, or OTHER' })
  @IsNotEmpty({ message: 'Gender is required' })
  gender: Gender;

  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string = 'PENDING';

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
  status?: string = 'ACTIVE';
}
