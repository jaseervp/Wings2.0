import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max, IsArray, IsBoolean, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDietTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string = 'General Nutrition';

  @IsNumber()
  @Min(0)
  minAge: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  maxAge: number;

  @IsOptional()
  @IsString()
  ageUnit?: string = 'Years';

  @IsOptional()
  @IsString()
  ageGroupPreset?: string;

  @IsOptional()
  @IsArray()
  mealSlots?: any[] = [];

  @IsOptional()
  @IsArray()
  dietaryRestrictions?: string[] = [];

  @IsOptional()
  @IsArray()
  excludedAllergens?: string[] = [];

  @IsOptional()
  @IsString()
  @IsIn(['MANUAL', 'AUTOMATIC', 'TEMPLATE_ONLY'])
  assignmentMode?: string = 'TEMPLATE_ONLY';

  @IsOptional()
  @IsBoolean()
  automaticAssignmentEnabled?: boolean = false;

  @IsOptional()
  @IsString()
  @IsIn(['ACTIVE', 'ARCHIVED', 'DRAFT'])
  status?: string = 'ACTIVE';

  @IsOptional()
  @IsString()
  iconBg?: string;

  @IsOptional()
  @IsString()
  iconColor?: string;

  // Optional children to assign immediately if Manual/Automatic mode
  @IsOptional()
  @IsArray()
  selectedChildIds?: string[];
}
