import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../common/enums/role.enum';
import { UserStatus, UserPlan } from '../../users/schemas/user.schema';

export class CreateAdminUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @MinLength(7, { message: 'Phone number must be at least 7 digits' })
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters' })
  phone: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Temporary password must be at least 6 characters' })
  temporaryPassword?: string;

  @IsEnum(UserRole, { message: 'Role must be one of: PARENT, THERAPIST, ADMIN' })
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRole;

  @IsOptional()
  @IsEnum(UserStatus, { message: 'Invalid account status' })
  status?: UserStatus = UserStatus.ACTIVE;

  @IsOptional()
  @IsEnum(UserPlan, { message: 'Invalid plan identifier' })
  plan?: UserPlan = UserPlan.FREE;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  availability?: string;
}
