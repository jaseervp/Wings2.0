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
  Res,
} from '@nestjs/common';
import { AdminTherapistsService } from './admin-therapists.service';
import { ListAdminTherapistsDto } from './dto/list-admin-therapists.dto';
import { CreateAdminTherapistDto } from './dto/create-admin-therapist.dto';
import { UpdateAdminTherapistDto } from './dto/update-admin-therapist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';

@Controller('admin/therapists')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminTherapistsController {
  constructor(private readonly adminTherapistsService: AdminTherapistsService) {}

  @Get()
  async findAll(@Query() query: ListAdminTherapistsDto) {
    return this.adminTherapistsService.findAll(query);
  }

  @Get('specializations')
  async getSpecializations() {
    const data = await this.adminTherapistsService.getSpecializations();
    return { success: true, data };
  }

  @Get('export')
  async exportCsv(@Query() query: ListAdminTherapistsDto, @Res() res: any) {
    const csv = await this.adminTherapistsService.exportCsv(query);
    const filename = `wings-therapists-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminTherapistsService.findOne(id);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateAdminTherapistDto) {
    const adminId = req.user.id || req.user.sub || req.user._id;
    return this.adminTherapistsService.create(adminId, dto);
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateAdminTherapistDto,
  ) {
    const adminId = req.user.id || req.user.sub || req.user._id;
    return this.adminTherapistsService.update(adminId, id, dto);
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    const adminId = req.user.id || req.user.sub || req.user._id;
    return this.adminTherapistsService.delete(adminId, id);
  }
}
