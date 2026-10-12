import { IsString, IsNotEmpty, IsOptional, IsNumber, IsObject } from 'class-validator';
import { CreateChildDto } from '../../children/dto/create-child.dto';

export class SaveProgressDto {
  @IsNumber()
  @IsOptional()
  stepIndex?: number;

  @IsString()
  @IsOptional()
  childId?: string;

  @IsOptional()
  childData?: Partial<CreateChildDto>;

  @IsObject()
  @IsOptional()
  assessmentResponses?: Record<string, string>;
}

export class CompleteOnboardingDto {
  @IsString()
  @IsOptional()
  childId?: string;

  @IsOptional()
  childData?: CreateChildDto;

  @IsObject()
  @IsOptional()
  assessmentResponses?: Record<string, string>;
}
