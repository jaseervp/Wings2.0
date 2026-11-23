import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { AssignmentSource } from '../schemas/child-activity-plan.schema';

export class AssignExerciseDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  childIds: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  exerciseIds: string[];

  @IsDateString()
  @IsNotEmpty()
  scheduledDate: string; // YYYY-MM-DD

  @IsString()
  @IsOptional()
  scheduledTime?: string;

  @IsEnum(AssignmentSource)
  @IsOptional()
  assignmentSource?: AssignmentSource = AssignmentSource.MANUAL;

  @IsBoolean()
  @IsOptional()
  therapistApproved?: boolean = true;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class PreviewAssignmentDto {
  @IsString()
  @IsNotEmpty()
  childId: string;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;
}

export class UpdateAssignmentDto {
  @IsOptional()
  @IsString()
  scheduledDate?: string;

  @IsOptional()
  @IsString()
  scheduledTime?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  therapistApproved?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
