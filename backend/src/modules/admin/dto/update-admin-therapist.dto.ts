import { IsString, IsOptional, IsEmail, MinLength, MaxLength, IsEnum, IsNumber } from 'class-validator';
import { UserStatus } from '../../users/schemas/user.schema';

export class UpdateAdminTherapistDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsNumber()
  activePatientCount?: number;
}
