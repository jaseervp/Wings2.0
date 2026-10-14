import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AdminAssessmentsService } from './admin-assessments.service';
import { AssessmentResponse } from '../assessment/schemas/assessment-response.schema';
import { User } from '../users/schemas/user.schema';
import { Child } from '../children/schemas/child.schema';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('AdminAssessmentsService', () => {
  let service: AdminAssessmentsService;
  let mockAssessmentModel: any;
  let mockUserModel: any;
  let mockChildModel: any;

  const mockAssessmentId = new Types.ObjectId().toString();
  const mockParentId = new Types.ObjectId().toString();
  const mockChildId = new Types.ObjectId().toString();

  const sampleAssessmentDoc = {
    _id: new Types.ObjectId(mockAssessmentId),
    assessmentCode: 'A-2201',
    parentId: mockParentId,
    childId: mockChildId,
    type: 'PRELIMINARY',
    responses: {
      '0': 'always',
      '1': 'always',
      '2': 'often',
      '3': 'always',
      '4': 'always',
    },
    status: 'COMPLETED',
    version: '1.0',
    flagged: false,
    createdAt: new Date('2026-10-12T10:00:00Z'),
    completedAt: new Date('2026-10-12T10:00:00Z'),
    save: jest.fn().mockResolvedValue(true),
  };

  const sampleParentDoc = {
    _id: new Types.ObjectId(mockParentId),
    fullName: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543210',
    role: 'PARENT',
  };

  const sampleChildDoc = {
    _id: new Types.ObjectId(mockChildId),
    firstName: 'Aarav',
    lastName: 'Sharma',
    preferredName: 'Aaru',
    gender: 'MALE',
    dateOfBirth: new Date('2020-04-15'),
  };

  beforeEach(async () => {
    mockAssessmentModel = {
      aggregate: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
    };

    mockUserModel = {
      findById: jest.fn(),
    };

    mockChildModel = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminAssessmentsService,
        {
          provide: getModelToken(AssessmentResponse.name),
          useValue: mockAssessmentModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Child.name),
          useValue: mockChildModel,
        },
      ],
    }).compile();

    service = module.get<AdminAssessmentsService>(AdminAssessmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated assessments with child and parent info', async () => {
      mockAssessmentModel.aggregate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue([
          {
            totalCount: [{ count: 1 }],
            data: [
              {
                ...sampleAssessmentDoc,
                parentUser: sampleParentDoc,
                childDoc: sampleChildDoc,
              },
            ],
          },
        ]),
      });

      // Second call for getSummaryCounts
      mockAssessmentModel.aggregate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue([
          {
            total: 1,
            needsReview: 1,
            reviewed: 0,
            inProgress: 0,
            flagged: 0,
          },
        ]),
      });

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].assessmentCode).toBe('A-2201');
      expect(result.data[0].child.name).toBe('Aarav Sharma');
      expect(result.data[0].parent.name).toBe('Priya Sharma');
      expect(result.data[0].completion).toBe(100);
      expect(result.data[0].status).toBe('Needs Review');
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return full assessment details with questionnaire', async () => {
      mockAssessmentModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(sampleAssessmentDoc),
        }),
      });

      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(sampleParentDoc),
          }),
        }),
      });

      mockChildModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(sampleChildDoc),
        }),
      });

      const result = await service.findOne(mockAssessmentId);
      expect(result.success).toBe(true);
      expect(result.data.assessmentCode).toBe('A-2201');
      expect(result.data.questionnaire).toHaveLength(5);
      expect(result.data.questionnaire[0].answer).toBe('always');
      expect(result.data.questionnaire[0].answerLabel).toBe('Always');
    });

    it('should throw NotFoundException if assessment does not exist', async () => {
      mockAssessmentModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('reviewAssessment', () => {
    it('should update assessment status to REVIEWED and record reviewer', async () => {
      const doc = {
        ...sampleAssessmentDoc,
        save: jest.fn().mockResolvedValue(true),
      };

      mockAssessmentModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(doc),
      });

      jest.spyOn(service, 'findOne').mockResolvedValue({
        success: true,
        data: { ...sampleAssessmentDoc, status: 'Reviewed', statusCode: 'REVIEWED' } as any,
      });

      const result = await service.reviewAssessment('admin-123', mockAssessmentId, {
        status: 'REVIEWED',
        reviewNotes: 'Developmental milestones are on track.',
      });

      expect(doc.status).toBe('REVIEWED');
      expect(doc.reviewedBy).toBe('admin-123');
      expect(doc.reviewNotes).toBe('Developmental milestones are on track.');
      expect(result.success).toBe(true);
    });
  });

  describe('flagAssessment', () => {
    it('should update flagged status and reason', async () => {
      const doc = {
        ...sampleAssessmentDoc,
        save: jest.fn().mockResolvedValue(true),
      };

      mockAssessmentModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(doc),
      });

      jest.spyOn(service, 'findOne').mockResolvedValue({
        success: true,
        data: { ...sampleAssessmentDoc, flagged: true, flagReason: 'Speech delay noted' } as any,
      });

      const result = await service.flagAssessment('admin-123', mockAssessmentId, {
        flagged: true,
        flagReason: 'Speech delay noted',
      });

      expect(doc.flagged).toBe(true);
      expect(doc.flagReason).toBe('Speech delay noted');
      expect(result.success).toBe(true);
    });
  });

  describe('exportCsv', () => {
    it('should export sanitized CSV with assessment data', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue({
        success: true,
        data: [
          {
            assessmentCode: 'A-2201',
            child: { name: 'Aarav Sharma' },
            parent: { name: 'Priya Sharma', email: 'priya@example.com' },
            date: 'Today 09:15 AM',
            completion: 100,
            status: 'Needs Review',
            flagged: true,
            flagReason: 'Speech delay',
          } as any,
        ],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
        summary: {} as any,
      });

      const csv = await service.exportCsv({});
      expect(csv).toContain('Assessment ID,Child Patient,Parent Name');
      expect(csv).toContain('"A-2201"');
      expect(csv).toContain('"Aarav Sharma"');
      expect(csv).toContain('"Priya Sharma"');
      expect(csv).toContain('"Needs Review"');
    });
  });
});
