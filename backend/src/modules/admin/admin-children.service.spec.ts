import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AdminChildrenService } from './admin-children.service';
import { Child, Gender } from '../children/schemas/child.schema';
import { User } from '../users/schemas/user.schema';
import { UserRole } from '../../common/enums/role.enum';
import { AssessmentResponse } from '../assessment/schemas/assessment-response.schema';

describe('AdminChildrenService', () => {
  let service: AdminChildrenService;

  const mockChildren = [
    {
      _id: '6acd009521d56732d81b48b6',
      parentId: '6ab182ce0284185b383e6b68',
      firstName: 'Aarav',
      lastName: 'Sharma',
      preferredName: 'Aaru',
      dateOfBirth: new Date('2021-04-15'),
      gender: Gender.MALE,
      diagnosis: 'MODERATE',
      iqBand: 'Moderate',
      status: 'ACTIVE',
      createdAt: new Date('2026-10-12T10:00:00Z'),
      parentUser: [
        {
          _id: '6ab182ce0284185b383e6b68',
          fullName: 'Priya Sharma',
          email: 'priya@example.com',
          role: 'PARENT',
        },
      ],
      latestAssessment: [
        {
          completedAt: new Date('2026-09-28T10:00:00Z'),
        },
      ],
    },
  ];

  function MockChildModel(doc: any) {
    return {
      ...doc,
      _id: '6acd009521d56732d81b48b7',
      save: jest.fn().mockResolvedValue({
        ...doc,
        _id: '6acd009521d56732d81b48b7',
        toObject: () => ({ ...doc, _id: '6acd009521d56732d81b48b7' }),
      }),
      toObject: () => ({ ...doc, _id: '6acd009521d56732d81b48b7' }),
    };
  }

  MockChildModel.aggregate = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([
      {
        totalCount: [{ count: 1 }],
        children: mockChildren,
      },
    ]),
  });

  MockChildModel.findById = jest.fn();

  const mockUserModel = {
    findById: jest.fn(),
    find: jest.fn(),
  };

  const mockAssessmentModel = {
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminChildrenService,
        {
          provide: getModelToken(Child.name),
          useValue: MockChildModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(AssessmentResponse.name),
          useValue: mockAssessmentModel,
        },
      ],
    }).compile();

    service = module.get<AdminChildrenService>(AdminChildrenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated children with resolved parent and age', async () => {
      const res = await service.findAll({ page: 1, limit: 12 });
      expect(res.success).toBe(true);
      expect(res.data).toHaveLength(1);
      expect(res.data[0].fullName).toBe('Aarav Sharma');
      expect(res.data[0].parent).toBe('Priya Sharma');
      expect(res.data[0].age).toBeDefined();
      expect(res.pagination.total).toBe(1);
    });
  });

  describe('create', () => {
    it('should create a child profile when valid parent exists', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: '6ab182ce0284185b383e6b68',
          fullName: 'Priya Sharma',
          email: 'priya@example.com',
          role: UserRole.PARENT,
        }),
      });

      const res = await service.create('admin-id', {
        parentId: '6ab182ce0284185b383e6b68',
        firstName: 'Vikram',
        lastName: 'Singh',
        dateOfBirth: '2021-05-10',
        gender: Gender.MALE,
        diagnosis: 'MILD',
      });

      expect(res.success).toBe(true);
      expect(res.data.fullName).toBe('Vikram Singh');
      expect(res.data.parent).toBe('Priya Sharma');
    });

    it('should reject creation if parent is not found', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.create('admin-id', {
          parentId: '6ab182ce0284185b383e6b68',
          firstName: 'Vikram',
          lastName: 'Singh',
          dateOfBirth: '2021-05-10',
          gender: Gender.MALE,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject creation if date of birth is in future', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: '6ab182ce0284185b383e6b68',
          role: UserRole.PARENT,
        }),
      });

      await expect(
        service.create('admin-id', {
          parentId: '6ab182ce0284185b383e6b68',
          firstName: 'Future',
          lastName: 'Baby',
          dateOfBirth: '2099-01-01',
          gender: Gender.FEMALE,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('exportCsv', () => {
    it('should export sanitized CSV with child and parent headers', async () => {
      const csv = await service.exportCsv({});
      expect(csv).toContain('"Child ID","Child Name"');
      expect(csv).toContain('"Aarav Sharma"');
      expect(csv).toContain('"Priya Sharma"');
    });
  });
});
