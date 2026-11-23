import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ExerciseService } from './exercise.service';
import { Exercise, ExerciseDifficulty, ExerciseStatus } from './schemas/exercise.schema';
import { ExerciseCategory } from './schemas/exercise-category.schema';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let mockExerciseModel: any;
  let mockCategoryModel: any;

  beforeEach(async () => {
    mockExerciseModel = {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
      countDocuments: jest.fn().mockResolvedValue(0),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      insertMany: jest.fn().mockResolvedValue([]),
    };

    mockCategoryModel = {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
      findOneAndUpdate: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseService,
        {
          provide: getModelToken(Exercise.name),
          useValue: mockExerciseModel,
        },
        {
          provide: getModelToken(ExerciseCategory.name),
          useValue: mockCategoryModel,
        },
      ],
    }).compile();

    service = module.get<ExerciseService>(ExerciseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find exercises with query filters', async () => {
    const result = await service.findAll({
      search: 'balance',
      category: 'Motor',
      difficulty: ExerciseDifficulty.MEDIUM,
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(result.items).toEqual([]);
    expect(mockExerciseModel.find).toHaveBeenCalled();
  });

  it('should seed default exercises if count is 0', async () => {
    mockExerciseModel.countDocuments.mockResolvedValue(0);
    const seedResult = await service.seedDefaults('admin123');
    expect(seedResult.seeded).toBe(true);
    expect(mockExerciseModel.insertMany).toHaveBeenCalled();
  });
});
