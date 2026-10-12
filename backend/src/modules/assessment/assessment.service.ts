import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssessmentResponse, AssessmentResponseDocument } from './schemas/assessment-response.schema';
import { SaveAssessmentDto } from './dto/save-assessment.dto';
import { ChildrenService } from '../children/children.service';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectModel(AssessmentResponse.name)
    private readonly assessmentModel: Model<AssessmentResponseDocument>,
    private readonly childrenService: ChildrenService,
  ) {}

  async savePreliminary(parentId: string, dto: SaveAssessmentDto): Promise<AssessmentResponseDocument> {
    // Validate child ownership
    await this.childrenService.findOneByParent(dto.childId, parentId);

    const type = dto.type || 'PRELIMINARY';
    let existing = await this.assessmentModel.findOne({
      parentId,
      childId: dto.childId,
      type,
    });

    if (existing) {
      existing.responses = dto.responses;
      existing.status = dto.status || 'COMPLETED';
      existing.completedAt = new Date();
      if (dto.version) existing.version = dto.version;
      return existing.save();
    }

    const created = new this.assessmentModel({
      parentId,
      childId: dto.childId,
      type,
      responses: dto.responses,
      status: dto.status || 'COMPLETED',
      version: dto.version || '1.0',
      completedAt: new Date(),
    });

    return created.save();
  }

  async getLatestPreliminary(parentId: string, childId: string): Promise<AssessmentResponseDocument | null> {
    // Validate child ownership
    await this.childrenService.findOneByParent(childId, parentId);

    return this.assessmentModel
      .findOne({ parentId, childId, type: 'PRELIMINARY' })
      .sort({ createdAt: -1 })
      .exec();
  }
}
