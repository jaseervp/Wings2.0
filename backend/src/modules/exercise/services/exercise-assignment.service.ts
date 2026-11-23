import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ChildActivityPlan,
  ChildActivityPlanDocument,
  ActivityPlanStatus,
  AssignmentSource,
} from '../schemas/child-activity-plan.schema';
import { Exercise, ExerciseDocument, ExerciseStatus } from '../schemas/exercise.schema';
import { Child, ChildDocument } from '../../children/schemas/child.schema';
import {
  ExerciseAssignmentRule,
  ExerciseAssignmentRuleDocument,
} from '../schemas/exercise-assignment-rule.schema';
import {
  AssignExerciseDto,
  PreviewAssignmentDto,
  UpdateAssignmentDto,
} from '../dto/assign-exercise.dto';

@Injectable()
export class ExerciseAssignmentService {
  private readonly logger = new Logger(ExerciseAssignmentService.name);

  constructor(
    @InjectModel(ChildActivityPlan.name)
    private readonly activityPlanModel: Model<ChildActivityPlanDocument>,
    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<ExerciseDocument>,
    @InjectModel(Child.name)
    private readonly childModel: Model<ChildDocument>,
    @InjectModel(ExerciseAssignmentRule.name)
    private readonly ruleModel: Model<ExerciseAssignmentRuleDocument>,
  ) {}

  /**
   * Helper to calculate a child's exact age in years from date of birth
   */
  calculateAge(dateOfBirth: Date | string): number {
    if (!dateOfBirth) return 5;
    const dob = new Date(dateOfBirth);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }

  /**
   * Manual assignment of exercises to one or more children
   */
  async assignExercises(userId: string, dto: AssignExerciseDto) {
    if (!dto.childIds || dto.childIds.length === 0) {
      throw new BadRequestException('At least one child must be selected.');
    }
    if (!dto.exerciseIds || dto.exerciseIds.length === 0) {
      throw new BadRequestException('At least one exercise must be selected.');
    }

    // Verify all exercises exist and are published
    const exercises = await this.exerciseModel.find({
      _id: { $in: dto.exerciseIds.map((id) => new Types.ObjectId(id)) },
      status: ExerciseStatus.PUBLISHED,
    });

    if (exercises.length === 0) {
      throw new BadRequestException('None of the selected exercises were found or published.');
    }

    const createdPlans: ChildActivityPlan[] = [];
    const skippedDuplicates: string[] = [];

    for (const childId of dto.childIds) {
      if (!Types.ObjectId.isValid(childId)) continue;
      const child = await this.childModel.findById(childId);
      if (!child) continue;

      let order = 1;
      // Get current max order for this child on this date
      const lastPlan = await this.activityPlanModel
        .findOne({ childId, scheduledDate: dto.scheduledDate })
        .sort({ order: -1 });
      if (lastPlan && lastPlan.order) {
        order = lastPlan.order + 1;
      }

      for (const ex of exercises) {
        // Check uniqueness
        const existing = await this.activityPlanModel.findOne({
          childId,
          exerciseId: ex._id.toString(),
          scheduledDate: dto.scheduledDate,
        });

        if (existing) {
          skippedDuplicates.push(`${child.firstName}: ${ex.title}`);
          continue;
        }

        const plan = new this.activityPlanModel({
          childId,
          exerciseId: ex._id.toString(),
          assignedBy: userId,
          assignmentSource: dto.assignmentSource || AssignmentSource.MANUAL,
          scheduledDate: dto.scheduledDate,
          scheduledTime: dto.scheduledTime || '09:00 AM',
          order: order++,
          status: ActivityPlanStatus.PENDING,
          therapistApproved: dto.therapistApproved ?? true,
          notes: dto.notes || '',
        });

        const saved = await plan.save();
        createdPlans.push(saved);
      }
    }

    return {
      success: true,
      message: `Assigned ${createdPlans.length} activities successfully.`,
      data: {
        createdCount: createdPlans.length,
        skippedCount: skippedDuplicates.length,
        skippedDuplicates,
      },
    };
  }

  /**
   * Evaluates child profile and generates recommendation preview based on clinical criteria
   */
  async previewRecommendations(dto: PreviewAssignmentDto) {
    if (!Types.ObjectId.isValid(dto.childId)) {
      throw new BadRequestException('Invalid child ID');
    }

    const child = await this.childModel.findById(dto.childId);
    if (!child) {
      throw new NotFoundException('Child not found');
    }

    const childAge = this.calculateAge(child.dateOfBirth);

    // Find active exercises matching the child's age range
    const candidateExercises = await this.exerciseModel
      .find({
        status: ExerciseStatus.PUBLISHED,
        minAge: { $lte: childAge },
        maxAge: { $gte: childAge },
      })
      .lean();

    // Score candidates based on child's developmental profile
    const scored = candidateExercises.map((ex) => {
      let matchScore = 50; // base score
      const reasons: string[] = [`Age appropriate (${childAge} years old)`];

      // Check delays / concerns matching category
      const concerns = [
        child.primaryConcerns,
        child.motorSkillsDelays,
        child.speechLanguageDelays,
        child.socialInteractionConcerns,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (concerns.includes('motor') && ex.category.toLowerCase().includes('motor')) {
        matchScore += 30;
        reasons.push('Addresses noted motor skill development needs');
      }
      if (concerns.includes('sensory') && ex.category.toLowerCase().includes('sensory')) {
        matchScore += 30;
        reasons.push('Supports sensory modulation and regulation');
      }
      if (concerns.includes('speech') && ex.category.toLowerCase().includes('speech')) {
        matchScore += 30;
        reasons.push('Focuses on speech intelligibility and communication');
      }
      if (ex.recommended) {
        matchScore += 15;
        reasons.push('Therapist-recommended foundational exercise');
      }

      return {
        ...ex,
        matchScore,
        recommendationReasons: reasons,
      };
    });

    // Sort by match score descending
    scored.sort((a, b) => b.matchScore - a.matchScore);

    // Pick top 4 for daily recommended therapy program
    const topRecommended = scored.slice(0, 4);

    return {
      success: true,
      data: {
        childId: child._id,
        childName: `${child.firstName} ${child.lastName}`,
        calculatedAge: childAge,
        recommendedExercises: topRecommended,
      },
    };
  }

  /**
   * Get assignments with filters
   */
  async getAssignments(params: {
    childId?: string;
    scheduledDate?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const filter: any = {};
    if (params.childId && Types.ObjectId.isValid(params.childId)) {
      filter.childId = params.childId;
    }
    if (params.scheduledDate) {
      filter.scheduledDate = params.scheduledDate;
    }
    if (params.status && params.status !== 'ALL') {
      filter.status = params.status;
    }

    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 50));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.activityPlanModel
        .find(filter)
        .populate('exerciseId')
        .populate('childId', 'firstName lastName profilePhoto dateOfBirth')
        .sort({ scheduledDate: -1, order: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.activityPlanModel.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update an assignment
   */
  async updateAssignment(id: string, dto: UpdateAssignmentDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid assignment ID');
    }

    const plan = await this.activityPlanModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true },
    );

    if (!plan) {
      throw new NotFoundException('Assignment not found');
    }
    return plan;
  }

  /**
   * Delete / cancel an assignment
   */
  async deleteAssignment(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid assignment ID');
    }
    const result = await this.activityPlanModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Assignment not found');
    }
    return { success: true, message: 'Assignment removed' };
  }
}
