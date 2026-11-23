import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ExerciseVideoService } from './services/exercise-video.service';
import { Exercise, VideoProcessingStatus } from './schemas/exercise.schema';

describe('ExerciseVideoService', () => {
  let service: ExerciseVideoService;
  let mockExerciseModel: any;

  beforeEach(async () => {
    mockExerciseModel = {
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseVideoService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'AWS_REGION') return 'us-east-1';
              if (key === 'AWS_S3_BUCKET') return 'wings-exercise-media';
              if (key === 'AWS_S3_VIDEO_PREFIX') return 'exercise-videos/';
              return null;
            }),
          },
        },
        {
          provide: getModelToken(Exercise.name),
          useValue: mockExerciseModel,
        },
      ],
    }).compile();

    service = module.get<ExerciseVideoService>(ExerciseVideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize video upload with valid mime type and size', async () => {
    const res = await service.initUpload({
      originalFilename: 'routine.mp4',
      mimeType: 'video/mp4',
      fileSize: 15000000,
    });

    expect(res.success).toBe(true);
    expect(res.data.uploadUrl).toBeDefined();
    expect(res.data.objectKey).toContain('exercise-videos/');
  });

  it('should reject invalid file extensions', async () => {
    await expect(
      service.initUpload({
        originalFilename: 'malicious.exe',
        mimeType: 'video/mp4',
        fileSize: 1000,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject oversized video files (> 250MB)', async () => {
    await expect(
      service.initUpload({
        originalFilename: 'huge.mp4',
        mimeType: 'video/mp4',
        fileSize: 300 * 1024 * 1024,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should provide playback URL for existing exercise', async () => {
    const mockId = new Types.ObjectId().toString();
    mockExerciseModel.findById.mockResolvedValue({
      _id: mockId,
      durationMinutes: 5,
      media: {
        status: VideoProcessingStatus.READY,
        s3Key: 'exercise-videos/test.mp4',
        processedKey: 'processed-exercises/test.mp4',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        durationSeconds: 300,
      },
    });

    const res = await service.getPlaybackUrl(mockId);
    expect(res.success).toBe(true);
    expect(res.data.playbackUrl).toBeDefined();
  });
});
