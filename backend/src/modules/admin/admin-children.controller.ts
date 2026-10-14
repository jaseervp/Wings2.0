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
import { AdminChildrenService } from './admin-children.service';
import { ListAdminChildrenDto } from './dto/list-admin-children.dto';
import { CreateAdminChildDto } from './dto/create-admin-child.dto';
import { UpdateAdminChildDto } from './dto/update-admin-child.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';

@Controller('admin/children')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminChildrenController {
  constructor(private readonly adminChildrenService: AdminChildrenService) {}

  @Get()
  async findAll(@Query() query: ListAdminChildrenDto) {
    return this.adminChildrenService.findAll(query);
  }

  @Get('parents')
  async getParents(@Query('search') search?: string) {
    return this.adminChildrenService.getParents(search);
  }

  @Get('export')
  async exportCsv(@Query() query: ListAdminChildrenDto, @Res() res: any) {
    const csv = await this.adminChildrenService.exportCsv(query);
    const filename = `wings-children-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminChildrenService.findOne(id);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateAdminChildDto) {
    const adminId = req.user.id || req.user.sub || req.user._id;
    return this.adminChildrenService.create(adminId, dto);
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateAdminChildDto,
  ) {
    const adminId = req.user.id || req.user.sub || req.user._id;
    return this.adminChildrenService.update(adminId, id, dto);
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    const adminId = req.user.id || req.user.sub || req.user._id;
    return this.adminChildrenService.delete(adminId, id);
  }
}
