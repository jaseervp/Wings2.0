import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OnboardingSession, OnboardingSessionDocument } from './schemas/onboarding-session.schema';
import { ChildrenService } from '../children/children.service';
import { AssessmentService } from '../assessment/assessment.service';
import { UsersService } from '../users/users.service';
import { SaveProgressDto, CompleteOnboardingDto } from './dto/onboarding.dto';
import { OnboardingStatus } from '../../common/enums/onboarding-status.enum';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectModel(OnboardingSession.name)
    private readonly sessionModel: Model<OnboardingSessionDocument>,
    private readonly childrenService: ChildrenService,
    private readonly assessmentService: AssessmentService,
    private readonly usersService: UsersService,
  ) {}

  async getStatus(parentId: string) {
    const user = await this.usersService.findById(parentId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let session = await this.sessionModel.findOne({ parentId }).exec();

    // Check if parent has children in database
    const children = await this.childrenService.findByParent(parentId);
    const existingChild = children.length > 0 ? children[0] : null;

    // Load any existing assessment for the child
    let assessment: any = null;
    if (existingChild) {
      assessment = await this.assessmentService.getLatestPreliminary(parentId, existingChild._id.toString());
    }

    return {
      success: true,
      data: {
        onboardingStatus: user.onboardingStatus,
        session: session || null,
        child: existingChild || null,
        assessment: assessment || null,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    };
  }

  async saveProgress(parentId: string, dto: SaveProgressDto) {
    const user = await this.usersService.findById(parentId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If onboarding is already completed, do not revert to in_progress
    if (user.onboardingStatus === OnboardingStatus.NOT_STARTED) {
      user.onboardingStatus = OnboardingStatus.IN_PROGRESS;
      await user.save();
    }

    let session = await this.sessionModel.findOne({ parentId }).exec();
    if (!session) {
      session = new this.sessionModel({
        parentId,
        startedAt: new Date(),
        status: 'IN_PROGRESS',
      });
    }

    let childId = dto.childId || session.childId;

    // If child data is provided, save or update child profile
    if (dto.childData && (dto.childData.firstName || dto.childData.dateOfBirth)) {
      if (childId) {
        // Update existing child
        await this.childrenService.update(childId, parentId, dto.childData as any);
      } else {
        // Check if there is an existing child for this parent first before creating duplicate
        const existingChildren = await this.childrenService.findByParent(parentId);
        if (existingChildren.length > 0) {
          childId = existingChildren[0]._id.toString();
          await this.childrenService.update(childId, parentId, dto.childData as any);
        } else if (dto.childData.firstName && dto.childData.lastName && dto.childData.dateOfBirth && dto.childData.gender) {
          // Create child profile if required basic fields exist
          const newChild = await this.childrenService.create(parentId, dto.childData as any);
          childId = newChild._id.toString();
        }
      }
    }

    if (childId) {
      session.childId = childId;
    }

    if (dto.stepIndex !== undefined) {
      session.stepIndex = dto.stepIndex;
    }

    if (dto.assessmentResponses) {
      session.assessmentResponses = {
        ...(session.assessmentResponses || {}),
        ...dto.assessmentResponses,
      };

      // Also persist to assessment collection if child exists
      if (childId) {
        await this.assessmentService.savePreliminary(parentId, {
          childId,
          responses: session.assessmentResponses,
          status: 'DRAFT',
        });
      }
    }

    session.lastSavedAt = new Date();
    await session.save();

    return {
      success: true,
      message: 'Onboarding progress saved',
      data: {
        session,
        childId,
      },
    };
  }

  async completeOnboarding(parentId: string, dto: CompleteOnboardingDto) {
    const user = await this.usersService.findById(parentId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Idempotency check: if user has already completed onboarding
    if (user.onboardingStatus === OnboardingStatus.COMPLETED) {
      const children = await this.childrenService.findByParent(parentId);
      return {
        success: true,
        message: 'Onboarding already completed',
        data: {
          onboardingStatus: OnboardingStatus.COMPLETED,
          child: children[0] || null,
        },
      };
    }

    let session = await this.sessionModel.findOne({ parentId }).exec();
    let childId = dto.childId || session?.childId;

    // Save or update child data
    if (dto.childData) {
      if (childId) {
        await this.childrenService.update(childId, parentId, dto.childData);
      } else {
        const existingChildren = await this.childrenService.findByParent(parentId);
        if (existingChildren.length > 0) {
          childId = existingChildren[0]._id.toString();
          await this.childrenService.update(childId, parentId, dto.childData);
        } else {
          // Validate required child fields
          if (!dto.childData.firstName || !dto.childData.lastName || !dto.childData.dateOfBirth || !dto.childData.gender) {
            throw new BadRequestException('Required child information is missing');
          }
          const createdChild = await this.childrenService.create(parentId, dto.childData);
          childId = createdChild._id.toString();
        }
      }
    } else if (!childId) {
      const existingChildren = await this.childrenService.findByParent(parentId);
      if (existingChildren.length > 0) {
        childId = existingChildren[0]._id.toString();
      } else {
        throw new BadRequestException('A child profile is required to complete onboarding');
      }
    }

    // Save preliminary assessment if provided or from session draft
    const assessmentAnswers = dto.assessmentResponses || session?.assessmentResponses || {};
    if (childId && Object.keys(assessmentAnswers).length > 0) {
      await this.assessmentService.savePreliminary(parentId, {
        childId,
        responses: assessmentAnswers,
        status: 'COMPLETED',
      });
    }

    // Mark session as COMPLETED
    if (!session) {
      session = new this.sessionModel({
        parentId,
        startedAt: new Date(),
      });
    }
    session.childId = childId;
    session.status = 'COMPLETED';
    session.stepIndex = 6;
    session.completedAt = new Date();
    session.lastSavedAt = new Date();
    await session.save();

    // Mark user status as COMPLETED
    user.onboardingStatus = OnboardingStatus.COMPLETED;
    await user.save();

    const finalChild = await this.childrenService.findOneByParent(childId, parentId);

    return {
      success: true,
      message: 'Onboarding completed successfully',
      data: {
        onboardingStatus: OnboardingStatus.COMPLETED,
        child: finalChild,
        redirectUrl: '/dashboard',
      },
    };
  }
}
