import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Child, ChildDocument } from './schemas/child.schema';
import { CreateChildDto, UpdateChildDto } from './dto/create-child.dto';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectModel(Child.name) private readonly childModel: Model<ChildDocument>,
  ) {}

  async findByParent(parentId: string): Promise<ChildDocument[]> {
    return this.childModel.find({ parentId, status: { $ne: 'DELETED' } }).exec();
  }

  async findOneByParent(childId: string, parentId: string): Promise<ChildDocument> {
    const child = await this.childModel.findById(childId).exec();
    if (!child || child.status === 'DELETED') {
      throw new NotFoundException('Child profile not found');
    }
    if (child.parentId.toString() !== parentId) {
      throw new ForbiddenException('You do not have access to this child profile');
    }
    return child;
  }

  async create(parentId: string, dto: CreateChildDto): Promise<ChildDocument> {
    const created = new this.childModel({
      ...dto,
      parentId,
    });
    return created.save();
  }

  async update(childId: string, parentId: string, dto: UpdateChildDto): Promise<ChildDocument> {
    const child = await this.findOneByParent(childId, parentId);
    Object.assign(child, dto);
    return child.save();
  }
}
