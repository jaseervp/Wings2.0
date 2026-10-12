import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { getSignupOtpTemplate } from './templates/signup-otp.template';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('EMAIL_HOST');
    const port = this.configService.get<number>('EMAIL_PORT');
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASSWORD');

    if (!host || !port || !user || !pass) {
      this.logger.warn(`Email service configuration is incomplete. Emails will not be sent. host=${host} port=${port} user=${user} pass=${pass ? '***' : 'missing'}`);
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: this.configService.get<string>('EMAIL_SECURE') === 'true',
      auth: {
        user,
        pass,
      },
    });

    this.isConfigured = true;
  }

  async onModuleInit() {
    if (this.isConfigured && this.transporter) {
      try {
        await this.transporter.verify();
        this.logger.log('SMTP connection verified successfully.');
      } catch (error) {
        this.logger.error('SMTP connection failed. Check your email configuration.', error.message);
        this.isConfigured = false; // Disable to prevent crashing on send
      }
    }
  }

  async sendSignupOtp(to: string, otp: string, expiresInMinutes: number, fullName: string = 'User') {
    if (!this.isConfigured) {
      this.logger.warn(`Could not send email to ${to}: Email service is not configured properly.`);
      throw new Error('Unable to send verification code. Please try again later.');
    }

    const htmlContent = getSignupOtpTemplate(fullName, otp, expiresInMinutes);
    const from = this.configService.get<string>('EMAIL_FROM') || 'WINGS <no-reply@wings.platform>';

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'WINGS – Verify Your Account',
        html: htmlContent,
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to send signup OTP email to ${to}: ${error.message}`);
      throw new Error('Unable to send verification code. Please try again later.');
    }
  }

  async sendPasswordResetOtp(to: string, otp: string, expiresInMinutes: number) {
    if (!this.isConfigured) {
      this.logger.warn(`Could not send password reset email to ${to}: Email service is not configured properly.`);
      throw new Error('Unable to send verification code. Please try again later.');
    }

    const from = this.configService.get<string>('EMAIL_FROM') || 'WINGS <no-reply@wings.platform>';
    
    // In a full implementation, create a separate template for password reset.
    // Reusing the basic logic for now.
    const htmlContent = `
      <h2>Reset Your Password</h2>
      <p>Your password reset code is: <strong>${otp}</strong></p>
      <p>This code expires in ${expiresInMinutes} minutes.</p>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'WINGS Password Reset Request',
        html: htmlContent,
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to send password reset OTP email to ${to}: ${error.message}`);
      throw new Error('Unable to send verification code. Please try again later.');
    }
  }
}
