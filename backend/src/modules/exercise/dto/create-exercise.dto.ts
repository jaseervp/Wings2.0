import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExerciseDifficulty, AgeUnit, ExerciseStatus } from '../schemas/exercise.schema';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  instructions?: string[];

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skillAreas?: string[];

  @IsEnum(ExerciseDifficulty)
  @IsOptional()
  difficulty?: ExerciseDifficulty;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  durationMinutes?: number;

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

  @IsBoolean()
  @IsOptional()
  recommended?: boolean;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  bg?: string;

  @IsEnum(ExerciseStatus)
  @IsOptional()
  status?: ExerciseStatus;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;
}
