import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { SaveProgressDto, CompleteOnboardingDto } from './dto/onboarding.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('status')
  async getStatus(@Req() req) {
    const parentId = req.user.sub || req.user.id;
    return this.onboardingService.getStatus(parentId);
  }

  @Post('progress')
  async saveProgress(@Body() dto: SaveProgressDto, @Req() req) {
    const parentId = req.user.sub || req.user.id;
    return this.onboardingService.saveProgress(parentId, dto);
  }

  @Post('complete')
  async completeOnboarding(@Body() dto: CompleteOnboardingDto, @Req() req) {
    const parentId = req.user.sub || req.user.id;
    return this.onboardingService.completeOnboarding(parentId, dto);
  }
}
