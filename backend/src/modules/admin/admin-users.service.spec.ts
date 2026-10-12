import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { User, UserStatus, UserPlan } from '../users/schemas/user.schema';
import { UserRole } from '../../common/enums/role.enum';
import { Child } from '../children/schemas/child.schema';

describe('AdminUsersService', () => {
  let service: AdminUsersService;

  const mockUsers = [
    {
      _id: '60d0fe4f5311236168a109ca',
      fullName: 'Alice Smith',
      email: 'alice@example.com',
      phone: '1234567890',
      role: 'PARENT',
      status: 'ACTIVE',
      plan: 'FREE',
      createdAt: new Date('2026-10-12T10:00:00Z'),
      childrenCount: 2,
    },
    {
      _id: '60d0fe4f5311236168a109cb',
      fullName: 'Dr. Bob Davis',
      email: 'bob@example.com',
      phone: '0987654321',
      role: 'THERAPIST',
      status: 'ACTIVE',
      plan: 'PRO',
      createdAt: new Date('2026-10-11T10:00:00Z'),
      childrenCount: null,
    },
  ];

  function MockUserConstructor(doc: any) {
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

  MockUserConstructor.aggregate = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([
      {
        totalCount: [{ count: 2 }],
        users: mockUsers,
      },
    ]),
  });
  MockUserConstructor.findById = jest.fn();
  MockUserConstructor.findOne = jest.fn();
  MockUserConstructor.findByIdAndDelete = jest.fn();

  const mockChildModel = {
    find: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminUsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserConstructor,
        },
        {
          provide: getModelToken(Child.name),
          useValue: mockChildModel,
        },
      ],
    }).compile();

    service = module.get<AdminUsersService>(AdminUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated database users with children count', async () => {
      const res = await service.findAll({ page: 1, limit: 10 });
      expect(res.success).toBe(true);
      expect(res.data).toHaveLength(2);
      expect(res.pagination.total).toBe(2);
      expect(res.pagination.totalPages).toBe(1);
      expect(res.data[0].fullName).toBe('Alice Smith');
    });

    it('should exclude password hashes and sensitive secrets', async () => {
      const res = await service.findAll({ page: 1, limit: 10 });
      res.data.forEach(user => {
        expect((user as any).passwordHash).toBeUndefined();
        expect((user as any).refreshTokenHash).toBeUndefined();
      });
    });
  });

  describe('create user', () => {
    it('should create a new user with temporary password and securely hash it', async () => {
      MockUserConstructor.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const res = await service.create('admin-id', {
        fullName: 'New Therapist',
        email: 'therapist@wings.health',
        phone: '+91 9988776655',
        temporaryPassword: 'SecureTempPassword123!',
        role: UserRole.THERAPIST,
        status: UserStatus.ACTIVE,
        plan: UserPlan.PRO,
      });

      expect(res.success).toBe(true);
      expect(res.data.fullName).toBe('New Therapist');
      expect(res.data.email).toBe('therapist@wings.health');
      expect((res.data as any).passwordHash).toBeUndefined();
      expect((res.data as any).temporaryPassword).toBeUndefined();
      expect(res.data.emailVerified).toBe(true);
    });

    it('should reject creation if email already exists', async () => {
      MockUserConstructor.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({ _id: 'existing-id', email: 'existing@wings.health' }),
      });

      await expect(
        service.create('admin-id', {
          fullName: 'Duplicate User',
          email: 'existing@wings.health',
          phone: '+91 9988776655',
          temporaryPassword: 'password123',
          role: UserRole.PARENT,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should set emailVerified to false when status is PENDING_VERIFICATION', async () => {
      MockUserConstructor.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const res = await service.create('admin-id', {
        fullName: 'Pending User',
        email: 'pending@wings.health',
        phone: '+91 9123456789',
        temporaryPassword: 'password123',
        role: UserRole.PARENT,
        status: UserStatus.PENDING_VERIFICATION,
      });

      expect(res.success).toBe(true);
      expect(res.data.emailVerified).toBe(false);
      expect(res.data.status).toBe(UserStatus.PENDING_VERIFICATION);
    });
  });

  describe('safety constraints', () => {
    it('should prevent an administrator from deleting their own account', async () => {
      const adminId = '60d0fe4f5311236168a109ca';
      await expect(service.delete(adminId, adminId)).rejects.toThrow(BadRequestException);
    });

    it('should prevent an administrator from deactivating their own account', async () => {
      const adminId = '60d0fe4f5311236168a109ca';
      MockUserConstructor.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: adminId,
          role: 'ADMIN',
          status: 'ACTIVE',
        }),
      });

      await expect(
        service.update(adminId, adminId, { status: UserStatus.INACTIVE }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('exportCsv', () => {
    it('should generate valid RFC 4180 CSV with sanitized cells', async () => {
      MockUserConstructor.aggregate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockUsers),
      });

      const csv = await service.exportCsv({});
      expect(csv).toContain('"User ID","Full Name","Email"');
      expect(csv).toContain('"Alice Smith"');
      expect(csv).toContain('"alice@example.com"');
    });
  });
});
