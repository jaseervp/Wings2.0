import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseVideoService } from './services/exercise-video.service';
import { ExerciseAssignmentService } from './services/exercise-assignment.service';
import { ExerciseTemplateService } from './services/exercise-template.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseQueryDto } from './dto/exercise-query.dto';
import {
  VideoUploadInitDto,
  VideoUploadCompleteDto,
} from './dto/video-upload.dto';
import {
  AssignExerciseDto,
  PreviewAssignmentDto,
  UpdateAssignmentDto,
} from './dto/assign-exercise.dto';
import {
  CreateProgramTemplateDto,
  AssignProgramTemplateDto,
} from './dto/create-program-template.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';

@Controller('admin/exercises')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.THERAPIST)
export class AdminExerciseController {
  constructor(
    private readonly exerciseService: ExerciseService,
    private readonly videoService: ExerciseVideoService,
    private readonly assignmentService: ExerciseAssignmentService,
    private readonly templateService: ExerciseTemplateService,
  ) {}

  // --- PROGRAM TEMPLATES ---

  @Get('templates')
  async getTemplates() {
    const templates = await this.templateService.findAll();
    return { success: true, data: templates };
  }

  @Post('templates/seed-defaults')
  async seedTemplatesDefaults(@Req() req: any) {
    const userId = req.user.id || req.user.sub;
    const res = await this.templateService.seedDefaults(userId);
    return { success: true, ...res };
  }

  @Get('templates/:id')
  async getTemplate(@Param('id') id: string) {
    const template = await this.templateService.findOne(id);
    return { success: true, data: template };
  }

  @Post('templates')
  async createTemplate(@Req() req: any, @Body() dto: CreateProgramTemplateDto) {
    const userId = req.user.id || req.user.sub;
    const template = await this.templateService.create(userId, dto);
    return { success: true, message: 'Program template created successfully', data: template };
  }

  @Patch('templates/:id')
  async updateTemplate(@Param('id') id: string, @Body() dto: Partial<CreateProgramTemplateDto>) {
    const template = await this.templateService.update(id, dto);
    return { success: true, message: 'Program template updated successfully', data: template };
  }

  @Delete('templates/:id')
  async deleteTemplate(@Param('id') id: string) {
    return await this.templateService.remove(id);
  }

  @Post('templates/:id/assign')
  async assignTemplate(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: AssignProgramTemplateDto,
  ) {
    const userId = req.user.id || req.user.sub;
    return await this.templateService.assignToChild(id, userId, dto);
  }

  // --- SEEDING & CATEGORIES ---

  @Post('seed-defaults')
  async seedDefaults(@Req() req: any) {
    const userId = req.user.id || req.user.sub;
    const res = await this.exerciseService.seedDefaults(userId);
    return { success: true, ...res };
  }

  @Get('categories')
  async getCategories() {
    const categories = await this.exerciseService.getCategories();
    return { success: true, data: categories };
  }

  // --- VIDEO UPLOAD & OPTIMIZATION ---

  @Post('video/upload-init')
  async initVideoUpload(@Body() dto: VideoUploadInitDto) {
    return await this.videoService.initUpload(dto);
  }

  @Post('video/upload-complete')
  async completeVideoUpload(@Body() dto: VideoUploadCompleteDto) {
    return await this.videoService.completeUpload(dto);
  }

  @Get(':id/video-status')
  async getVideoStatus(@Param('id') id: string) {
    return await this.videoService.getVideoStatus(id);
  }

  @Post(':id/video-retry')
  async retryVideoProcessing(@Param('id') id: string) {
    return await this.videoService.retryProcessing(id);
  }

  @Get(':id/playback-url')
  async getPlaybackUrl(@Param('id') id: string) {
    return await this.videoService.getPlaybackUrl(id);
  }

  // Helper mock direct upload route for local / dev testing when real S3 bucket is not configured
  @Post('video/mock-s3-upload')
  @HttpCode(HttpStatus.OK)
  async mockS3Upload() {
    return { success: true, message: 'Simulated direct S3 upload accepted' };
  }

  // --- ASSIGNMENTS ---

  @Post('assignments/preview')
  async previewAssignments(@Body() dto: PreviewAssignmentDto) {
    return await this.assignmentService.previewRecommendations(dto);
  }

  @Post('assignments')
  async assignExercises(@Req() req: any, @Body() dto: AssignExerciseDto) {
    const userId = req.user.id || req.user.sub;
    return await this.assignmentService.assignExercises(userId, dto);
  }

  @Get('assignments')
  async getAssignments(
    @Query('childId') childId?: string,
    @Query('scheduledDate') scheduledDate?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const res = await this.assignmentService.getAssignments({
      childId,
      scheduledDate,
      status,
      page,
      limit,
    });
    return { success: true, data: res };
  }

  @Patch('assignments/:id')
  async updateAssignment(@Param('id') id: string, @Body() dto: UpdateAssignmentDto) {
    const res = await this.assignmentService.updateAssignment(id, dto);
    return { success: true, data: res };
  }

  @Delete('assignments/:id')
  async deleteAssignment(@Param('id') id: string) {
    return await this.assignmentService.deleteAssignment(id);
  }

  // --- EXERCISE LIBRARY CRUD ---

  @Get()
  async getExercises(@Query() query: ExerciseQueryDto) {
    const res = await this.exerciseService.findAll(query);
    return { success: true, data: res };
  }

  @Get(':id')
  async getExercise(@Param('id') id: string) {
    const res = await this.exerciseService.findOne(id);
    return { success: true, data: res };
  }

  @Post()
  async createExercise(@Req() req: any, @Body() dto: CreateExerciseDto) {
    const userId = req.user.id || req.user.sub;
    const res = await this.exerciseService.create(userId, dto);
    return { success: true, message: 'Exercise created successfully', data: res };
  }

  @Patch(':id')
  async updateExercise(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateExerciseDto,
  ) {
    const userId = req.user.id || req.user.sub;
    const res = await this.exerciseService.update(id, userId, dto);
    return { success: true, message: 'Exercise updated successfully', data: res };
  }

  @Post(':id/archive')
  async archiveExercise(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id || req.user.sub;
    const res = await this.exerciseService.archive(id, userId);
    return { success: true, message: 'Exercise archived successfully', data: res };
  }

  @Delete(':id')
  async removeExercise(@Param('id') id: string) {
    await this.exerciseService.remove(id);
    return { success: true, message: 'Exercise deleted successfully' };
  }
}
