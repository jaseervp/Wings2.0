import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto, UpdateChildDto } from './dto/create-child.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('children')
@UseGuards(JwtAuthGuard)
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Get()
  async getMyChildren(@Req() req) {
    const parentId = req.user.sub || req.user.id;
    const children = await this.childrenService.findByParent(parentId);
    return {
      success: true,
      data: children,
    };
  }

  @Get(':childId')
  async getChild(@Param('childId') childId: string, @Req() req) {
    const parentId = req.user.sub || req.user.id;
    const child = await this.childrenService.findOneByParent(childId, parentId);
    return {
      success: true,
      data: child,
    };
  }

  @Post()
  async createChild(@Body() dto: CreateChildDto, @Req() req) {
    const parentId = req.user.sub || req.user.id;
    const child = await this.childrenService.create(parentId, dto);
    return {
      success: true,
      message: 'Child profile created successfully',
      data: child,
    };
  }

  @Patch(':childId')
  async updateChild(@Param('childId') childId: string, @Body() dto: UpdateChildDto, @Req() req) {
    const parentId = req.user.sub || req.user.id;
    const child = await this.childrenService.update(childId, parentId, dto);
    return {
      success: true,
      message: 'Child profile updated successfully',
      data: child,
    };
  }
}
