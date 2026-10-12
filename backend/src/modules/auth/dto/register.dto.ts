import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean, MinLength, MaxLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^(?!^[0-9]+$)[a-zA-Z0-9\s.\-']+$/, {
    message: 'Full name cannot contain only numbers and must have valid characters.',
  })
  @Transform(({ value }) => value?.trim())
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format (e.g., +919876543210)',
  })
  @Transform(({ value }) => value?.trim())
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message: 'Password must be strong (contain uppercase, lowercase, number, and special character)',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsBoolean()
  @IsNotEmpty()
  termsAccepted: boolean;

  @IsBoolean()
  @IsOptional()
  marketingConsent?: boolean;
}

