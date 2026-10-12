import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { SaveAssessmentDto } from './dto/save-assessment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('assessment')
@UseGuards(JwtAuthGuard)
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post('preliminary')
  async savePreliminary(@Body() dto: SaveAssessmentDto, @Req() req) {
    const parentId = req.user.sub || req.user.id;
    const assessment = await this.assessmentService.savePreliminary(parentId, dto);
    return {
      success: true,
      message: 'Assessment saved successfully',
      data: assessment,
    };
  }

  @Get('preliminary/:childId')
  async getPreliminary(@Param('childId') childId: string, @Req() req) {
    const parentId = req.user.sub || req.user.id;
    const assessment = await this.assessmentService.getLatestPreliminary(parentId, childId);
    return {
      success: true,
      data: assessment,
    };
  }
}
