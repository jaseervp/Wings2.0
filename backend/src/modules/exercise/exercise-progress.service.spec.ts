import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ExerciseProgressService } from './services/exercise-progress.service';
import { ChildActivityPlan, ActivityPlanStatus } from './schemas/child-activity-plan.schema';
import { ActivityLog, CompletionStatus } from './schemas/activity-log.schema';
import { Exercise } from './schemas/exercise.schema';
import { Child } from '../children/schemas/child.schema';
import { TherapistFeedback } from './schemas/therapist-feedback.schema';
import { SkillProgress } from './schemas/skill-progress.schema';
import { AssessmentResponse } from '../assessment/schemas/assessment-response.schema';
import { ExerciseAssignmentService } from './services/exercise-assignment.service';

describe('ExerciseProgressService', () => {
  let service: ExerciseProgressService;
  let mockActivityPlanModel: any;
  let mockActivityLogModel: any;
  let mockExerciseModel: any;
  let mockChildModel: any;
  let mockFeedbackModel: any;
  let mockSkillProgressModel: any;
  let mockAssessmentModel: any;
  let mockAssignmentService: any;

  beforeEach(async () => {
    mockActivityPlanModel = {
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
      findById: jest.fn(),
    };

    mockActivityLogModel = {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      countDocuments: jest.fn().mockResolvedValue(3),
      deleteOne: jest.fn(),
    };

    mockExerciseModel = {
      findById: jest.fn(),
    };

    mockChildModel = {
      findById: jest.fn(),
      findOne: jest.fn(),
    };

    mockFeedbackModel = {
      findOne: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        _id: 'fb1',
        therapistName: 'Dr. Sarah Jenkins',
        therapistRole: 'Occupational Therapist',
        feedback: 'Great improvement',
      }),
    };

    mockSkillProgressModel = {
      find: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    };

    mockAssessmentModel = {
      findOne: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null),
    };

    mockAssignmentService = {
      calculateAge: jest.fn().mockReturnValue(6),
      previewRecommendations: jest.fn().mockResolvedValue({ data: { recommendedExercises: [] } }),
      assignExercises: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseProgressService,
        { provide: getModelToken(ChildActivityPlan.name), useValue: mockActivityPlanModel },
        { provide: getModelToken(ActivityLog.name), useValue: mockActivityLogModel },
        { provide: getModelToken(Exercise.name), useValue: mockExerciseModel },
        { provide: getModelToken(Child.name), useValue: mockChildModel },
        { provide: getModelToken(TherapistFeedback.name), useValue: mockFeedbackModel },
        { provide: getModelToken(SkillProgress.name), useValue: mockSkillProgressModel },
        { provide: getModelToken(AssessmentResponse.name), useValue: mockAssessmentModel },
        { provide: ExerciseAssignmentService, useValue: mockAssignmentService },
      ],
    }).compile();

    service = module.get<ExerciseProgressService>(ExerciseProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject access if parent does not own child', async () => {
    const childId = new Types.ObjectId().toString();
    mockChildModel.findById.mockResolvedValue({
      _id: childId,
      parentId: new Types.ObjectId().toString(), // different parent
    });

    await expect(service.validateChildAccess(childId, 'parent999')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should return 0 streak when no completion logs exist', async () => {
    const streak = await service.calculateStreak(new Types.ObjectId().toString());
    expect(streak).toBe(0);
  });

  it('should calculate milestones from actual records', async () => {
    const childId = new Types.ObjectId().toString();
    const parentId = new Types.ObjectId().toString();
    mockChildModel.findById.mockResolvedValue({
      _id: childId,
      parentId,
    });

    const res = await service.getMilestones(parentId, childId);
    expect(res.success).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
  });
});
