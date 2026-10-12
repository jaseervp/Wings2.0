import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { UserStatus } from '../../users/schemas/user.schema';

export class CreateAdminTherapistDto {
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

  @IsString()
  @IsNotEmpty({ message: 'Specialization is required' })
  specialization: string;

  @IsOptional()
  @IsString()
  availability?: string = 'Mon - Fri';

  @IsOptional()
  @IsEnum(UserStatus, { message: 'Invalid account status' })
  status?: UserStatus = UserStatus.ACTIVE;
}
