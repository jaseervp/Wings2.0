import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AdminAssessmentsService } from './admin-assessments.service';
import { ListAdminAssessmentsDto } from './dto/list-admin-assessments.dto';
import { ReviewAdminAssessmentDto } from './dto/review-admin-assessment.dto';
import { FlagAdminAssessmentDto } from './dto/flag-admin-assessment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';

@Controller('admin/assessments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminAssessmentsController {
  constructor(private readonly adminAssessmentsService: AdminAssessmentsService) {}

  @Get()
  async findAll(@Query() query: ListAdminAssessmentsDto) {
    return this.adminAssessmentsService.findAll(query);
  }

  @Get('export')
  async exportCsv(@Query() query: ListAdminAssessmentsDto, @Res() res: any) {
    const csv = await this.adminAssessmentsService.exportCsv(query);
    const filename = `preliminary-assessments-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminAssessmentsService.findOne(id);
  }

  @Patch(':id/review')
  async review(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: ReviewAdminAssessmentDto,
  ) {
    const adminId = req.user.id || req.user.sub || req.user._id;
    return this.adminAssessmentsService.reviewAssessment(adminId, id, dto);
  }

  @Patch(':id/flag')
  async flag(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: FlagAdminAssessmentDto,
  ) {
    const adminId = req.user.id || req.user.sub || req.user._id;
    return this.adminAssessmentsService.flagAssessment(adminId, id, dto);
  }
}
