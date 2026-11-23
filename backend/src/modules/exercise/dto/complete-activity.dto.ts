import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CompleteActivityDto {
  @IsString()
  @IsNotEmpty()
  childId: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  durationCompleted?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  revert?: boolean;
}
