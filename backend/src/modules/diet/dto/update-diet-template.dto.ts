import { PartialType } from '@nestjs/mapped-types';
import { CreateDietTemplateDto } from './create-diet-template.dto';

export class UpdateDietTemplateDto extends PartialType(CreateDietTemplateDto) {}
