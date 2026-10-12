import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { AdminTherapistsService } from './admin-therapists.service';
import { User, UserStatus } from '../users/schemas/user.schema';
import { UserRole } from '../../common/enums/role.enum';

describe('AdminTherapistsService', () => {
  let service: AdminTherapistsService;

  const mockTherapists = [
    {
      _id: '60d0fe4f5311236168a109ca',
      fullName: 'Dr. Meera Nair',
      email: 'meera@wings.health',
      phone: '+91 9876543210',
      role: 'THERAPIST',
      status: 'ACTIVE',
      specialization: 'Speech Therapist',
      availability: 'Mon - Fri',
      rating: 4.8,
      reviewCount: 124,
      activePatientCount: 32,
      createdAt: new Date('2026-10-12T10:00:00Z'),
    },
    {
      _id: '60d0fe4f5311236168a109cb',
      fullName: 'Dr. Arun Kumar',
      email: 'arun@wings.health',
      phone: '+91 9876543211',
      role: 'THERAPIST',
      status: 'ACTIVE',
      specialization: 'Occupational Therapist',
      availability: 'Mon - Fri',
      rating: 4.9,
      reviewCount: 89,
      activePatientCount: 28,
      createdAt: new Date('2026-10-11T10:00:00Z'),
    },
  ];

  function MockUserModel(doc: any) {
    return {
      ...doc,
      _id: '60d0fe4f5311236168a109cc',
      save: jest.fn().mockResolvedValue({
        ...doc,
        _id: '60d0fe4f5311236168a109cc',
        toObject: () => ({ ...doc, _id: '60d0fe4f5311236168a109cc' }),
      }),
      toObject: () => ({ ...doc, _id: '60d0fe4f5311236168a109cc' }),
    };
  }

  MockUserModel.countDocuments = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(2),
  });

  MockUserModel.find = jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(mockTherapists),
  });

  MockUserModel.findOne = jest.fn();
  MockUserModel.distinct = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(['Speech Therapist', 'Occupational Therapist']),
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminTherapistsService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    service = module.get<AdminTherapistsService>(AdminTherapistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated therapist cards from MongoDB', async () => {
      const res = await service.findAll({ page: 1, limit: 9 });
      expect(res.success).toBe(true);
      expect(res.data).toHaveLength(2);
      expect(res.pagination.total).toBe(2);
      expect(res.data[0].fullName).toBe('Dr. Meera Nair');
      expect(res.data[0].specialization).toBe('Speech Therapist');
    });

    it('should exclude sensitive authentication fields', async () => {
      const res = await service.findAll({});
      res.data.forEach((t) => {
        expect((t as any).passwordHash).toBeUndefined();
        expect((t as any).refreshTokenHash).toBeUndefined();
      });
    });
  });

  describe('getSpecializations', () => {
    it('should return unique specializations combining canonical and database values', async () => {
      const specs = await service.getSpecializations();
      expect(specs).toContain('Speech Therapy');
      expect(specs).toContain('Speech Therapist');
      expect(specs).toContain('Occupational Therapy');
    });
  });

  describe('create', () => {
    it('should create a therapist with hashed password and therapist role', async () => {
      MockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const res = await service.create('admin-id', {
        fullName: 'Dr. Sarah Thomas',
        email: 'sarah@wings.health',
        phone: '+91 9876543212',
        temporaryPassword: 'TempPassword123!',
        specialization: 'Child Psychology',
      });

      expect(res.success).toBe(true);
      expect(res.data.fullName).toBe('Dr. Sarah Thomas');
      expect(res.data.role).toBe(UserRole.THERAPIST);
      expect((res.data as any).passwordHash).toBeUndefined();
    });

    it('should reject duplicate email with ConflictException', async () => {
      MockUserModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({ _id: 'existing-id' }),
      });

      await expect(
        service.create('admin-id', {
          fullName: 'Duplicate Doc',
          email: 'duplicate@wings.health',
          phone: '+91 9999999999',
          temporaryPassword: 'Password123',
          specialization: 'Speech Therapy',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('exportCsv', () => {
    it('should export sanitized CSV containing therapist details', async () => {
      const csv = await service.exportCsv({});
      expect(csv).toContain('"Therapist ID","Full Name","Email"');
      expect(csv).toContain('"Dr. Meera Nair"');
      expect(csv).toContain('"Speech Therapist"');
    });
  });
});
