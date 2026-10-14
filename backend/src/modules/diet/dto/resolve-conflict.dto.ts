import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class ResolveConflictDto {
  @IsString()
  @IsIn(['CANCEL_ASSIGNMENT', 'SWITCH_TEMPLATE', 'OVERRIDE_CLINICAL'])
  action: 'CANCEL_ASSIGNMENT' | 'SWITCH_TEMPLATE' | 'OVERRIDE_CLINICAL';

  @IsOptional()
  @IsString()
  newDietTemplateId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
