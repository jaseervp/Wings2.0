import { IsString, IsOptional, IsIn } from 'class-validator';

export class ReviewAdminAssessmentDto {
  @IsString()
  @IsIn(['NEEDS_REVIEW', 'REVIEWED', 'IN_PROGRESS', 'COMPLETED'])
  status: string;

  @IsOptional()
  @IsString()
  reviewNotes?: string;
}
