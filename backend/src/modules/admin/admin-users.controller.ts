import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req, Res } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { ListAdminUsersDto } from './dto/list-admin-users.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  async findAll(@Query() query: ListAdminUsersDto) {
    return this.adminUsersService.findAll(query);
  }

  @Get('export')
  async exportCsv(@Query() query: ListAdminUsersDto, @Res() res: any) {
    const csvContent = await this.adminUsersService.exportCsv(query);
    const filename = `wings-users-${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminUsersService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateAdminUserDto, @Req() req: any) {
    const adminId = req.user.sub || req.user.id;
    return this.adminUsersService.create(adminId, dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAdminUserDto, @Req() req: any) {
    const adminId = req.user.sub || req.user.id;
    return this.adminUsersService.update(adminId, id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    const adminId = req.user.sub || req.user.id;
    return this.adminUsersService.delete(adminId, id);
  }
}
