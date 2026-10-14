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
} from '@nestjs/common';
import { DietService } from './diet.service';
import { CreateDietTemplateDto } from './dto/create-diet-template.dto';
import { UpdateDietTemplateDto } from './dto/update-diet-template.dto';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { ManualAssignDietDto, ConfirmAutoAssignDto } from './dto/assign-diet.dto';
import { ResolveConflictDto } from './dto/resolve-conflict.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';

@Controller('admin/diet')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class DietController {
  constructor(private readonly dietService: DietService) {}

  @Get('summary')
  async getSummary() {
    const summary = await this.dietService.getDashboardSummary();
    return { success: true, data: summary };
  }

  // --- TEMPLATES ---

  @Get('templates')
  async getTemplates(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    const templates = await this.dietService.getTemplates(search, category, status);
    return { success: true, data: templates };
  }

  @Get('templates/:id')
  async getTemplate(@Param('id') id: string) {
    const template = await this.dietService.getTemplate(id);
    return { success: true, data: template };
  }

  @Post('templates')
  async createTemplate(@Req() req: any, @Body() dto: CreateDietTemplateDto) {
    const adminId = req.user.id || req.user.sub || req.user._id;
    const template = await this.dietService.createTemplate(adminId, dto);
    return { success: true, message: 'Diet template created successfully', data: template };
  }

  @Patch('templates/:id')
  async updateTemplate(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateDietTemplateDto,
  ) {
    const adminId = req.user.id || req.user.sub || req.user._id;
    const template = await this.dietService.updateTemplate(adminId, id, dto);
    return { success: true, message: 'Diet template updated successfully', data: template };
  }

  @Post('templates/:id/archive')
  async archiveTemplate(@Req() req: any, @Param('id') id: string) {
    const adminId = req.user.id || req.user.sub || req.user._id;
    return this.dietService.archiveTemplate(adminId, id);
  }

  // --- FOOD DATABASE ---

  @Get('foods')
  async getFoods(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    const foods = await this.dietService.getFoods(search, category, status);
    return { success: true, data: foods };
  }

  @Post('foods')
  async createFood(@Body() dto: CreateFoodItemDto) {
    const food = await this.dietService.createFood(dto);
    return { success: true, message: 'Food item created successfully', data: food };
  }

  @Patch('foods/:id')
  async updateFood(@Param('id') id: string, @Body() dto: UpdateFoodItemDto) {
    const food = await this.dietService.updateFood(id, dto);
    return { success: true, message: 'Food item updated successfully', data: food };
  }

  @Delete('foods/:id')
  async deleteFood(@Param('id') id: string) {
    return this.dietService.deleteFood(id);
  }

  // --- ASSIGNMENT & CONFLICTS ---

  @Get('eligible-children/:templateId')
  async getEligibleChildren(
    @Param('templateId') templateId: string,
    @Query('search') search?: string,
  ) {
    const children = await this.dietService.getEligibleChildren(templateId, search);
    return { success: true, data: children };
  }

  @Post('assignments/manual')
  async manualAssign(@Req() req: any, @Body() dto: ManualAssignDietDto) {
    const adminId = req.user.id || req.user.sub || req.user._id;
    const result = await this.dietService.manualAssign(adminId, dto);
    return { success: true, message: 'Manual diet assignment completed', data: result };
  }

  @Get('assignments/auto/preview/:templateId')
  async previewAutoAssign(@Param('templateId') templateId: string) {
    const preview = await this.dietService.previewAutoAssign(templateId);
    return { success: true, data: preview };
  }

  @Post('assignments/auto/confirm')
  async confirmAutoAssign(@Req() req: any, @Body() dto: ConfirmAutoAssignDto) {
    const adminId = req.user.id || req.user.sub || req.user._id;
    const result = await this.dietService.confirmAutoAssign(adminId, dto);
    return { success: true, message: 'Automatic diet assignment confirmed', data: result };
  }

  @Get('conflicts')
  async getConflicts() {
    const conflicts = await this.dietService.getConflicts();
    return { success: true, data: conflicts };
  }

  @Post('conflicts/:assignmentId/resolve')
  async resolveConflict(
    @Req() req: any,
    @Param('assignmentId') assignmentId: string,
    @Body() dto: ResolveConflictDto,
  ) {
    const adminId = req.user.id || req.user.sub || req.user._id;
    const result = await this.dietService.resolveConflict(adminId, assignmentId, dto);
    return { success: true, message: result.message };
  }
}
