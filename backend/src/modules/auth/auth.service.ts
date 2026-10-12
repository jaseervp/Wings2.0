import { Injectable, BadRequestException, UnauthorizedException, NotFoundException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { UserStatus } from '../users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OtpVerification, OtpVerificationDocument, OtpChannel, OtpPurpose } from './schemas/otp-verification.schema';
import { EmailService } from '../notifications/email/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(OtpVerification.name) private otpModel: Model<OtpVerificationDocument>,
    private emailService: EmailService,
  ) {}

  private generateNumericOtp(length: number = 6): string {
    return Array.from({ length }, () => crypto.randomInt(0, 10)).join('');
  }

  private maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    return `${name.charAt(0)}***@${domain}`;
  }

  async register(registerDto: RegisterDto) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    if (!registerDto.termsAccepted) {
      throw new BadRequestException('Terms must be accepted');
    }

    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const existingPhone = await this.usersService.findByPhone(registerDto.phone);
    if (existingPhone) {
      throw new BadRequestException('Phone number already in use');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    const user = await this.usersService.create({
      fullName: registerDto.fullName,
      email: registerDto.email,
      phone: registerDto.phone,
      passwordHash,
      termsAccepted: registerDto.termsAccepted,
      termsAcceptedAt: new Date(),
      marketingConsent: registerDto.marketingConsent || false,
    });

    const otp = this.generateNumericOtp(6);
    const otpHash = await bcrypt.hash(otp, 10);
    const verificationId = crypto.randomUUID();
    const expiresInMinutes = parseInt(process.env.OTP_EXPIRES_IN || '5', 10);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);

    await this.otpModel.create({
      verificationId,
      userId: user._id.toString(),
      channel: OtpChannel.EMAIL,
      purpose: OtpPurpose.SIGNUP,
      otpHash,
      expiresAt,
      lastSentAt: new Date(),
    });

    await this.emailService.sendSignupOtp(user.email, otp, expiresInMinutes);

    return {
      success: true,
      message: 'Verification code sent successfully.',
      data: {
        verificationId,
        expiresIn: expiresInMinutes * 60,
        maskedDestination: this.maskEmail(user.email),
      },
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const verification = await this.otpModel.findOne({ verificationId: verifyOtpDto.verificationId });
    if (!verification) {
      throw new BadRequestException('This verification session is no longer valid. Please start signup again.');
    }

    if (verification.attempts >= verification.maxAttempts) {
      throw new HttpException('Too many incorrect attempts. Please request a new verification code.', HttpStatus.TOO_MANY_REQUESTS);
    }

    if (new Date() > verification.expiresAt) {
      throw new BadRequestException('This verification code has expired. Please request a new code.');
    }

    const isValid = await bcrypt.compare(verifyOtpDto.otp, verification.otpHash);
    
    verification.attempts += 1;
    await verification.save();

    if (!isValid) {
      throw new BadRequestException('The verification code is incorrect. Please try again.');
    }

    verification.verifiedAt = new Date();
    await verification.save();

    const user = await this.usersService.findById(verification.userId);
    if (!user) throw new NotFoundException('User not found');

    user.status = UserStatus.ACTIVE;
    if (verification.channel === OtpChannel.EMAIL) {
      user.emailVerified = true;
    } else if (verification.channel === OtpChannel.PHONE) {
      user.phoneVerified = true;
    }
    user.lastLoginAt = new Date();
    await user.save();

    const tokens = await this.generateTokens(user._id.toString(), user.role);
    await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);

    return {
      success: true,
      message: 'Account verified successfully.',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          onboardingStatus: (user as any).onboardingStatus, // Type cast just in case
        },
        tokens,
      },
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const verification = await this.otpModel.findOne({ verificationId: resendOtpDto.verificationId });
    if (!verification) {
      throw new BadRequestException('This verification session is no longer valid. Please start signup again.');
    }

    const user = await this.usersService.findById(verification.userId);
    if (!user) throw new NotFoundException('User not found');

    const maxResends = parseInt(process.env.OTP_MAX_RESENDS || '3', 10);
    const windowMinutes = parseInt(process.env.OTP_RESEND_WINDOW_MINUTES || '15', 10);

    let newResendCount = verification.resendCount || 0;
    
    if (verification.lastSentAt) {
      const windowPassed = (Date.now() - verification.lastSentAt.getTime()) > (windowMinutes * 60000);
      if (windowPassed) {
        newResendCount = 0;
      }
    }

    if (newResendCount >= maxResends) {
      throw new HttpException("You've requested too many verification codes. Please try again later.", HttpStatus.TOO_MANY_REQUESTS);
    }

    newResendCount += 1;

    const otp = this.generateNumericOtp(6);
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresInMinutes = parseInt(process.env.OTP_EXPIRES_IN || '5', 10);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);

    const newVerificationId = crypto.randomUUID();

    await this.otpModel.create({
      verificationId: newVerificationId,
      userId: user._id.toString(),
      channel: verification.channel,
      purpose: verification.purpose,
      otpHash,
      expiresAt,
      resendCount: newResendCount,
      lastSentAt: new Date(),
    });

    await this.otpModel.deleteOne({ _id: verification._id });

    if (verification.purpose === OtpPurpose.SIGNUP) {
      await this.emailService.sendSignupOtp(user.email, otp, expiresInMinutes);
    } else if (verification.purpose === OtpPurpose.PASSWORD_RESET) {
      await this.emailService.sendPasswordResetOtp(user.email, otp, expiresInMinutes);
    }

    return {
      success: true,
      message: 'Verification code resent successfully.',
      data: {
        verificationId: newVerificationId,
        expiresIn: expiresInMinutes * 60,
        maskedDestination: this.maskEmail(user.email),
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Account is suspended');
    }

    if (user.status === UserStatus.PENDING_VERIFICATION) {
      throw new ForbiddenException('Account is pending verification. Please verify your email first.');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user._id.toString(), user.role);
    await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);

    user.lastLoginAt = new Date();
    await user.save();

    return {
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          onboardingStatus: (user as any).onboardingStatus,
        },
        tokens,
      },
    };
  }

  async generateTokens(userId: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, role },
        {
          secret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret',
          expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN || '15m') as any,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
          expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d') as any,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      onboardingStatus: user.onboardingStatus,
      status: user.status,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
    };
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string | null) {
    let hash: string | null = null;
    if (refreshToken) {
      hash = await bcrypt.hash(refreshToken, 10);
    }
    await this.usersService.updateRefreshToken(userId, hash);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.generateTokens(user._id.toString(), user.role);
    await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);

    return tokens;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    
    // We always return a generic success message to prevent user enumeration
    if (!user) {
      return { success: true, message: 'If an account with that email exists, we have sent a password reset code.' };
    }

    const otp = this.generateNumericOtp(6);
    const otpHash = await bcrypt.hash(otp, 10);
    const verificationId = crypto.randomUUID();
    const expiresInMinutes = parseInt(process.env.OTP_EXPIRES_IN || '5', 10);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);

    await this.otpModel.create({
      verificationId,
      userId: user._id.toString(),
      channel: OtpChannel.EMAIL,
      purpose: OtpPurpose.PASSWORD_RESET,
      otpHash,
      expiresAt,
      lastSentAt: new Date(),
    });

    await this.emailService.sendPasswordResetOtp(user.email, otp, expiresInMinutes);

    return {
      success: true,
      message: 'If an account with that email exists, we have sent a password reset code.',
      data: {
        verificationId,
        expiresIn: expiresInMinutes * 60,
      },
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const verification = await this.otpModel.findOne({ 
      verificationId: resetPasswordDto.verificationId,
      purpose: OtpPurpose.PASSWORD_RESET 
    });

    if (!verification) {
      throw new BadRequestException('This verification session is no longer valid. Please request a new code.');
    }

    if (verification.attempts >= verification.maxAttempts) {
      throw new HttpException('Too many incorrect attempts. Please request a new verification code.', HttpStatus.TOO_MANY_REQUESTS);
    }

    if (new Date() > verification.expiresAt) {
      throw new BadRequestException('This verification code has expired. Please request a new code.');
    }

    const isValid = await bcrypt.compare(resetPasswordDto.otp, verification.otpHash);
    
    verification.attempts += 1;
    await verification.save();

    if (!isValid) {
      throw new BadRequestException('The verification code is incorrect. Please try again.');
    }

    const user = await this.usersService.findById(verification.userId);
    if (!user) throw new NotFoundException('User not found');

    const salt = await bcrypt.genSalt();
    user.passwordHash = await bcrypt.hash(resetPasswordDto.newPassword, salt);
    await user.save();

    verification.verifiedAt = new Date();
    await verification.save();

    return {
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    };
  }
}
