import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExerciseProgressService } from './services/exercise-progress.service';
import { ExerciseVideoService } from './services/exercise-video.service';
import { CompleteActivityDto } from './dto/complete-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('exercise')
@UseGuards(JwtAuthGuard)
export class ExerciseController {
  constructor(
    private readonly progressService: ExerciseProgressService,
    private readonly videoService: ExerciseVideoService,
  ) {}

  @Get('today')
  async getTodayActivities(
    @Req() req: any,
    @Query('childId') childId?: string,
    @Query('date') date?: string,
  ) {
    const parentId = req.user.id || req.user.sub;
    return await this.progressService.getTodayActivities(parentId, childId, date);
  }

  @Post('activities/:activityPlanId/complete')
  async completeActivity(
    @Req() req: any,
    @Param('activityPlanId') activityPlanId: string,
    @Body() dto: CompleteActivityDto,
  ) {
    const parentId = req.user.id || req.user.sub;
    return await this.progressService.completeActivity(parentId, activityPlanId, dto);
  }

  @Get('skills')
  async getSkillFocus(
    @Req() req: any,
    @Query('childId') childId: string,
  ) {
    const parentId = req.user.id || req.user.sub;
    return await this.progressService.getSkillFocus(parentId, childId);
  }

  @Get('therapist-feedback')
  async getTherapistFeedback(
    @Req() req: any,
    @Query('childId') childId: string,
  ) {
    const parentId = req.user.id || req.user.sub;
    return await this.progressService.getTherapistFeedback(parentId, childId);
  }

  @Get('coach')
  async getActivityCoach(
    @Req() req: any,
    @Query('childId') childId: string,
  ) {
    const parentId = req.user.id || req.user.sub;
    return await this.progressService.getActivityCoach(parentId, childId);
  }

  @Get('milestones')
  async getMilestones(
    @Req() req: any,
    @Query('childId') childId: string,
  ) {
    const parentId = req.user.id || req.user.sub;
    return await this.progressService.getMilestones(parentId, childId);
  }

  @Get('history')
  async getRecentHistory(
    @Req() req: any,
    @Query('childId') childId: string,
    @Query('limit') limit?: number,
  ) {
    const parentId = req.user.id || req.user.sub;
    return await this.progressService.getRecentHistory(parentId, childId, limit);
  }

  @Get('playback-url/:id')
  async getPlaybackUrl(@Param('id') id: string) {
    return await this.videoService.getPlaybackUrl(id);
  }
}
