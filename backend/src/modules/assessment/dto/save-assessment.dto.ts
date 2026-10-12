import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class SaveAssessmentDto {
  @IsString()
  @IsNotEmpty()
  childId: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsObject()
  @IsNotEmpty()
  responses: Record<string, string>;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  version?: string;
}
