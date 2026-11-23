import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ExerciseProgramTemplate,
  ExerciseProgramTemplateDocument,
} from '../schemas/exercise-program-template.schema';
import {
  ChildActivityPlan,
  ChildActivityPlanDocument,
  ActivityPlanStatus,
  AssignmentSource,
} from '../schemas/child-activity-plan.schema';
import { Exercise, ExerciseDocument, ExerciseDifficulty, AgeUnit } from '../schemas/exercise.schema';
import { Child, ChildDocument } from '../../children/schemas/child.schema';
import {
  CreateProgramTemplateDto,
  AssignProgramTemplateDto,
} from '../dto/create-program-template.dto';

@Injectable()
export class ExerciseTemplateService {
  private readonly logger = new Logger(ExerciseTemplateService.name);

  constructor(
    @InjectModel(ExerciseProgramTemplate.name)
    private readonly templateModel: Model<ExerciseProgramTemplateDocument>,
    @InjectModel(ChildActivityPlan.name)
    private readonly activityPlanModel: Model<ChildActivityPlanDocument>,
    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<ExerciseDocument>,
    @InjectModel(Child.name)
    private readonly childModel: Model<ChildDocument>,
  ) {}

  async findAll() {
    const templates = await this.templateModel
      .find({ isPublished: true })
      .populate('exerciseIds', 'title category durationMinutes difficulty media')
      .sort({ createdAt: -1 })
      .lean();

    return templates;
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid template ID');
    }

    const template = await this.templateModel
      .findById(id)
      .populate('exerciseIds')
      .lean();

    if (!template) {
      throw new NotFoundException('Exercise program template not found');
    }

    return template;
  }

  async create(userId: string, dto: CreateProgramTemplateDto) {
    const template = new this.templateModel({
      ...dto,
      exerciseIds: (dto.exerciseIds || []).map((id) => new Types.ObjectId(id)),
      createdBy: userId,
      assignedCount: 0,
    });

    return await template.save();
  }

  async update(id: string, dto: Partial<CreateProgramTemplateDto>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid template ID');
    }

    const updatePayload: any = { ...dto };
    if (dto.exerciseIds) {
      updatePayload.exerciseIds = dto.exerciseIds.map((exId) => new Types.ObjectId(exId));
    }

    const updated = await this.templateModel.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Program template not found');
    }

    return updated;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid template ID');
    }
    const result = await this.templateModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Program template not found');
    }
    return { success: true, message: 'Template removed successfully' };
  }

  /**
   * Assigns this entire multi-day structured program template to a child
   */
  async assignToChild(templateId: string, userId: string, dto: AssignProgramTemplateDto) {
    if (!Types.ObjectId.isValid(templateId)) {
      throw new BadRequestException('Invalid template ID');
    }
    if (!Types.ObjectId.isValid(dto.childId)) {
      throw new BadRequestException('Invalid child ID');
    }

    const [template, child] = await Promise.all([
      this.templateModel.findById(templateId),
      this.childModel.findById(dto.childId),
    ]);

    if (!template) throw new NotFoundException('Program template not found');
    if (!child) throw new NotFoundException('Child profile not found');

    const startDate = dto.startDate ? new Date(dto.startDate) : new Date();
    const durationDays = template.durationDays || 7;
    const exerciseIds = template.exerciseIds || [];

    if (exerciseIds.length === 0) {
      throw new BadRequestException('This program template has no exercises assigned to it.');
    }

    const createdPlans: any[] = [];

    // Schedule day by day
    for (let day = 0; day < durationDays; day++) {
      const scheduledDate = new Date(startDate);
      scheduledDate.setDate(scheduledDate.getDate() + day);
      const dateStr = scheduledDate.toISOString().split('T')[0];

      // Round-robin or pick exercises from pool
      const exIndex = day % exerciseIds.length;
      const exId = exerciseIds[exIndex];

      // Check if already assigned
      const existing = await this.activityPlanModel.findOne({
        childId: child._id,
        exerciseId: exId,
        scheduledDate: dateStr,
      });

      if (!existing) {
        const plan = new this.activityPlanModel({
          childId: child._id,
          exerciseId: exId,
          assignedBy: userId,
          assignmentSource: AssignmentSource.MANUAL,
          scheduledDate: dateStr,
          scheduledTime: '09:00 AM',
          order: 1,
          status: ActivityPlanStatus.PENDING,
          therapistApproved: true,
          notes: `${template.title} — Day ${day + 1} Routine`,
        });

        const saved = await plan.save();
        createdPlans.push(saved);
      }
    }

    // Increment assigned count
    await this.templateModel.findByIdAndUpdate(templateId, {
      $inc: { assignedCount: 1 },
    });

    return {
      success: true,
      message: `Assigned "${template.title}" (${durationDays} days) to ${child.firstName} successfully!`,
      data: {
        createdCount: createdPlans.length,
        childName: `${child.firstName} ${child.lastName}`,
        programTitle: template.title,
        durationDays,
      },
    };
  }

  /**
   * Seeds default structured program templates (7-day and 30-day)
   */
  async seedDefaults(userId?: string) {
    const count = await this.templateModel.countDocuments();
    if (count > 0) return { seeded: false, count };

    // Get available exercises to bind
    const exercises = await this.exerciseModel.find({ isPublished: true }).limit(10);
    const exIds = exercises.map((e) => e._id);
    const fallbackUserId = userId || new Types.ObjectId().toString();

    const defaults = [
      {
        title: '7-Day Sensory Integration Protocol',
        description:
          'Sequential 7-day deep pressure and vestibular routine designed to calm sensory hypersensitivity and improve daily focus.',
        durationDays: 7,
        category: 'Sensory',
        difficulty: ExerciseDifficulty.EASY,
        minAge: 3,
        maxAge: 8,
        ageUnit: AgeUnit.YEARS,
        exerciseIds: exIds.slice(0, 3),
        assignedCount: 12,
        isPublished: true,
        createdBy: fallbackUserId,
      },
      {
        title: '30-Day Gross Motor & Balance Booster',
        description:
          'Comprehensive 30-day progressive motor development program focusing on core strength, bilateral coordination, and rocker board balance.',
        durationDays: 30,
        category: 'Motor',
        difficulty: ExerciseDifficulty.MEDIUM,
        minAge: 4,
        maxAge: 12,
        ageUnit: AgeUnit.YEARS,
        exerciseIds: exIds.slice(1, 4),
        assignedCount: 28,
        isPublished: true,
        createdBy: fallbackUserId,
      },
      {
        title: '14-Day Speech & Articulation Journey',
        description:
          'Two-week structured speech therapy protocol focusing on vowel elongation, consonant pops, and communicative confidence.',
        durationDays: 14,
        category: 'Speech Therapy',
        difficulty: ExerciseDifficulty.EASY,
        minAge: 3,
        maxAge: 7,
        ageUnit: AgeUnit.YEARS,
        exerciseIds: exIds.slice(2, 5),
        assignedCount: 19,
        isPublished: true,
        createdBy: fallbackUserId,
      },
    ];

    await this.templateModel.insertMany(defaults);
    this.logger.log(`Seeded ${defaults.length} default structured exercise programs.`);
    return { seeded: true, count: defaults.length };
  }
}
