import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DietService } from './diet.service';
import { DietTemplate } from './schemas/diet-template.schema';
import { FoodItem } from './schemas/food-item.schema';
import { DietAssignment } from './schemas/diet-assignment.schema';
import { Child } from '../children/schemas/child.schema';
import { User } from '../users/schemas/user.schema';
import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('DietService', () => {
  let service: DietService;
  let mockTemplateModel: any;
  let mockFoodModel: any;
  let mockAssignmentModel: any;
  let mockChildModel: any;
  let mockUserModel: any;

  const mockTemplateId = new Types.ObjectId().toString();
  const mockChildId = new Types.ObjectId().toString();

  const sampleTemplate = {
    _id: new Types.ObjectId(mockTemplateId),
    name: 'Standard Auto-Immune Protocol',
    minAge: 3,
    maxAge: 6,
    category: 'Allergy-Aware',
    mealSlots: [
      {
        name: 'Lunch',
        foods: [{ foodName: 'Peanut Butter Toast', allergens: ['Peanuts'] }],
      },
    ],
    status: 'ACTIVE',
  };

  const sampleChild = {
    _id: new Types.ObjectId(mockChildId),
    firstName: 'Aarav',
    lastName: 'Sharma',
    dateOfBirth: new Date('2020-04-15'), // ~4 years old
    allergies: 'Peanuts',
  };

  beforeEach(async () => {
    mockTemplateModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      countDocuments: jest.fn().mockResolvedValue(4),
      insertMany: jest.fn(),
    };

    mockFoodModel = {
      find: jest.fn(),
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      countDocuments: jest.fn().mockResolvedValue(10),
      insertMany: jest.fn(),
    };

    mockAssignmentModel = {
      find: jest.fn(),
      findById: jest.fn(),
      countDocuments: jest.fn().mockResolvedValue(2),
      aggregate: jest.fn(),
      updateMany: jest.fn(),
    };

    mockChildModel = {
      find: jest.fn(),
      findById: jest.fn(),
    };

    mockUserModel = {
      find: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DietService,
        { provide: getModelToken(DietTemplate.name), useValue: mockTemplateModel },
        { provide: getModelToken(FoodItem.name), useValue: mockFoodModel },
        { provide: getModelToken(DietAssignment.name), useValue: mockAssignmentModel },
        { provide: getModelToken(Child.name), useValue: mockChildModel },
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<DietService>(DietService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('detectAllergyConflict', () => {
    it('should detect when child allergy matches template food allergen', () => {
      const result = service.detectAllergyConflict(sampleChild, sampleTemplate);
      expect(result.hasConflict).toBe(true);
      expect(result.allergen).toBe('PEANUTS');
    });

    it('should return no conflict when child has no recorded allergies', () => {
      const safeChild = { ...sampleChild, allergies: 'None' };
      const result = service.detectAllergyConflict(safeChild, sampleTemplate);
      expect(result.hasConflict).toBe(false);
    });
  });

  describe('calculateChildAgeInYears', () => {
    it('should calculate correct age from date of birth', () => {
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 4);
      const age = service.calculateChildAgeInYears(dob);
      expect(age).toBe(4);
    });
  });

  describe('getDashboardSummary', () => {
    it('should return real counts for templates, assignments, and conflicts', async () => {
      mockTemplateModel.countDocuments.mockResolvedValue(4);
      mockAssignmentModel.countDocuments
        .mockResolvedValueOnce(5) // active assignments
        .mockResolvedValueOnce(2); // unresolved conflicts
      mockFoodModel.countDocuments.mockResolvedValue(11);

      const summary = await service.getDashboardSummary();
      expect(summary.totalTemplates).toBe(4);
      expect(summary.totalAssigned).toBe(5);
      expect(summary.unresolvedConflicts).toBe(2);
      expect(summary.totalFoods).toBe(11);
    });
  });

  describe('createTemplate validation', () => {
    it('should reject when minAge > maxAge', async () => {
      await expect(
        service.createTemplate('admin-1', {
          name: 'Invalid Diet',
          minAge: 10,
          maxAge: 4,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
