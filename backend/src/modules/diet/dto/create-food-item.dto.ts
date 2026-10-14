import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateFoodItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  category?: string = 'General';

  @IsOptional()
  @IsArray()
  allergens?: string[] = [];

  @IsOptional()
  @IsString()
  ingredients?: string;

  @IsOptional()
  @IsString()
  servingUnit?: string = 'serving';

  @IsOptional()
  @IsObject()
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  };

  @IsOptional()
  @IsString()
  status?: string = 'ACTIVE';
}
