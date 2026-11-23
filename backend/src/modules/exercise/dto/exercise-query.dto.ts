import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ExerciseDifficulty, ExerciseStatus } from '../schemas/exercise.schema';

export class ExerciseQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(ExerciseDifficulty)
  difficulty?: ExerciseDifficulty;

  @IsOptional()
  @IsEnum(ExerciseStatus)
  status?: ExerciseStatus;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  targetAge?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number = 50;
}
