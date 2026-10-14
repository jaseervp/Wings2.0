import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class ManualAssignDietDto {
  @IsString()
  @IsNotEmpty()
  dietTemplateId: string;

  @IsArray()
  childIds: string[];

  @IsOptional()
  @IsBoolean()
  overrideConflicts?: boolean = false;
}

export class PreviewAutoAssignDto {
  @IsString()
  @IsNotEmpty()
  dietTemplateId: string;
}

export class ConfirmAutoAssignDto {
  @IsString()
  @IsNotEmpty()
  dietTemplateId: string;

  @IsOptional()
  @IsArray()
  selectedChildIds?: string[];
}
