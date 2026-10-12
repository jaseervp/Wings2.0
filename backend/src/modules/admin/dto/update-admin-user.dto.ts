import { IsString, IsOptional, IsEmail, MinLength, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '../../../common/enums/role.enum';
import { UserStatus, UserPlan } from '../../users/schemas/user.schema';

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsEnum(UserPlan)
  plan?: UserPlan;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  activePatientCount?: number;
}
