import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExerciseDifficulty, AgeUnit } from '../schemas/exercise.schema';

export class TemplateDayRoutineDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  dayNumber: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  exerciseIds?: string[];

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateProgramTemplateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  @Max(90)
  @Type(() => Number)
  durationDays: number; // e.g. 7, 14, 30

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(ExerciseDifficulty)
  @IsOptional()
  difficulty?: ExerciseDifficulty;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  minAge?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  maxAge?: number;

  @IsEnum(AgeUnit)
  @IsOptional()
  ageUnit?: AgeUnit;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  exerciseIds?: string[];

  @IsArray()
  @IsOptional()
  dailyRoutines?: TemplateDayRoutineDto[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class AssignProgramTemplateDto {
  @IsString()
  @IsNotEmpty()
  childId: string;

  @IsString()
  @IsOptional()
  startDate?: string; // YYYY-MM-DD
}
