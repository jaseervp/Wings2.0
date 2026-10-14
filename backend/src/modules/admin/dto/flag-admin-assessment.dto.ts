import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FlagAdminAssessmentDto {
  @IsBoolean()
  flagged: boolean;

  @IsOptional()
  @IsString()
  flagReason?: string;
}
