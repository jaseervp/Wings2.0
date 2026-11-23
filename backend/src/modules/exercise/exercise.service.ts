import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Exercise,
  ExerciseDocument,
  ExerciseStatus,
  ExerciseDifficulty,
  AgeUnit,
  VideoProcessingStatus,
} from './schemas/exercise.schema';
import {
  ExerciseCategory,
  ExerciseCategoryDocument,
} from './schemas/exercise-category.schema';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseQueryDto } from './dto/exercise-query.dto';

@Injectable()
export class ExerciseService {
  private readonly logger = new Logger(ExerciseService.name);

  constructor(
    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<ExerciseDocument>,
    @InjectModel(ExerciseCategory.name)
    private readonly categoryModel: Model<ExerciseCategoryDocument>,
  ) {}

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async create(userId: string, dto: CreateExerciseDto): Promise<Exercise> {
    const created = new this.exerciseModel({
      ...dto,
      createdBy: userId,
      updatedBy: userId,
      status: dto.status || ExerciseStatus.PUBLISHED,
      media: {
        originalFilename: '',
        s3Key: '',
        processedKey: '',
        thumbnailKey: '',
        thumbnailUrl: dto.thumbnailUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
        mimeType: 'video/mp4',
        fileSize: 0,
        processedFileSize: 0,
        durationSeconds: (dto.durationMinutes || 5) * 60,
        resolution: '720p',
        status: VideoProcessingStatus.READY,
      },
    });

    return await created.save();
  }

  async findAll(query: ExerciseQueryDto) {
    const filter: any = {};

    if (query.status && query.status !== ('ALL' as any)) {
      filter.status = query.status;
    } else {
      filter.status = { $ne: ExerciseStatus.ARCHIVED };
    }

    if (query.category && query.category !== 'All Categories' && query.category !== 'ALL') {
      filter.category = { $regex: new RegExp(`^${this.escapeRegex(query.category)}$`, 'i') };
    }

    if (query.difficulty) {
      filter.difficulty = query.difficulty;
    }

    if (query.targetAge !== undefined && !isNaN(query.targetAge)) {
      filter.minAge = { $lte: query.targetAge };
      filter.maxAge = { $gte: query.targetAge };
    }

    if (query.search && query.search.trim()) {
      const regex = new RegExp(this.escapeRegex(query.search.trim()), 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
        { skillAreas: regex },
      ];
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 50));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.exerciseModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.exerciseModel.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Exercise> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid exercise ID');
    }
    const exercise = await this.exerciseModel.findById(id).lean();
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }
    return exercise as unknown as Exercise;
  }

  async update(id: string, userId: string, dto: UpdateExerciseDto): Promise<Exercise> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid exercise ID');
    }

    const exercise = await this.exerciseModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        updatedBy: userId,
      },
      { new: true },
    );

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }
    return exercise;
  }

  async archive(id: string, userId: string): Promise<Exercise> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid exercise ID');
    }

    const exercise = await this.exerciseModel.findByIdAndUpdate(
      id,
      {
        status: ExerciseStatus.ARCHIVED,
        updatedBy: userId,
      },
      { new: true },
    );

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }
    return exercise;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid exercise ID');
    }
    const result = await this.exerciseModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Exercise not found');
    }
  }

  async getCategories() {
    const categories = await this.categoryModel
      .find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();
    return categories;
  }

  /**
   * Seeds initial exercise categories and clinical library if not already populated
   */
  async seedDefaults(userId?: string) {
    const existingCount = await this.exerciseModel.countDocuments();
    if (existingCount > 0) {
      return { seeded: false, count: existingCount };
    }

    const fallbackUserId = userId || new Types.ObjectId().toString();

    // 1. Seed categories
    const initialCategories = [
      { name: 'Sensory', slug: 'sensory', color: 'text-purple-600', bg: 'bg-purple-100', icon: 'Sparkles', order: 1 },
      { name: 'Motor', slug: 'motor', color: 'text-primary', bg: 'bg-primary/10', icon: 'Activity', order: 2 },
      { name: 'Cognitive', slug: 'cognitive', color: 'text-amber-600', bg: 'bg-amber-100', icon: 'Brain', order: 3 },
      { name: 'Occupational Therapy', slug: 'occupational-therapy', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: 'HeartHandshake', order: 4 },
      { name: 'Physical Exercise', slug: 'physical-exercise', color: 'text-blue-600', bg: 'bg-blue-100', icon: 'Dumbbell', order: 5 },
      { name: 'Speech Therapy', slug: 'speech-therapy', color: 'text-purple-600', bg: 'bg-purple-100', icon: 'MessageSquare', order: 6 },
      { name: 'Behavioral Therapy', slug: 'behavioral-therapy', color: 'text-rose-600', bg: 'bg-rose-100', icon: 'Smile', order: 7 },
      { name: 'Balance', slug: 'balance', color: 'text-cyan-600', bg: 'bg-cyan-100', icon: 'Compass', order: 8 },
    ];

    for (const cat of initialCategories) {
      await this.categoryModel.findOneAndUpdate(
        { slug: cat.slug },
        { ...cat, isActive: true },
        { upsert: true, new: true },
      );
    }

    // 2. Seed exercises matching both Admin and Parent screens
    const initialExercises = [
      {
        title: 'Deep Pressure Therapy',
        description: 'Therapeutic weighted compressions and joint proprioceptive input designed to calm the nervous system.',
        instructions: [
          'Have the child lie down comfortably on a soft mat.',
          'Gently apply firm, sustained pressure to limbs using hands or a therapy roll.',
          'Ensure continuous breathing and check child comfort every 30 seconds.',
        ],
        category: 'Sensory',
        skillAreas: ['Sensory Processing', 'Emotional Regulation', 'Body Awareness'],
        difficulty: ExerciseDifficulty.EASY,
        durationMinutes: 5,
        minAge: 2,
        maxAge: 12,
        ageUnit: AgeUnit.YEARS,
        recommended: true,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
        media: {
          originalFilename: 'deep-pressure-routine.mp4',
          s3Key: 'exercise-videos/seed-deep-pressure.mp4',
          processedKey: 'processed-exercises/seed-deep-pressure-720p.mp4',
          thumbnailKey: 'exercise-thumbnails/seed-deep-pressure.jpg',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
          mimeType: 'video/mp4',
          fileSize: 18450000,
          processedFileSize: 12100000,
          durationSeconds: 300,
          resolution: '720p',
          status: VideoProcessingStatus.READY,
          uploadTimestamp: new Date(),
          processedTimestamp: new Date(),
        },
        status: ExerciseStatus.PUBLISHED,
        createdBy: fallbackUserId,
      },
      {
        title: 'Balance Board Routine',
        description: 'Engaging dynamic vestibular and ankle stability exercises using a curved rocker balance board.',
        instructions: [
          'Place the rocker board on a non-slip surface.',
          'Support the child with hands while they step onto the balance board.',
          'Guide gentle side-to-side rocking for 10 counts, then practice steady centering.',
        ],
        category: 'Motor',
        skillAreas: ['Balance', 'Gross Motor', 'Core Stability'],
        difficulty: ExerciseDifficulty.MEDIUM,
        durationMinutes: 10,
        minAge: 3,
        maxAge: 12,
        ageUnit: AgeUnit.YEARS,
        recommended: true,
        color: 'text-primary',
        bg: 'bg-primary/10',
        media: {
          originalFilename: 'balance-board-session.mp4',
          s3Key: 'exercise-videos/seed-balance-board.mp4',
          processedKey: 'processed-exercises/seed-balance-board-720p.mp4',
          thumbnailKey: 'exercise-thumbnails/seed-balance-board.jpg',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544640808-32caaefce5ed?auto=format&fit=crop&q=80&w=600',
          mimeType: 'video/mp4',
          fileSize: 24500000,
          processedFileSize: 16200000,
          durationSeconds: 600,
          resolution: '720p',
          status: VideoProcessingStatus.READY,
          uploadTimestamp: new Date(),
          processedTimestamp: new Date(),
        },
        status: ExerciseStatus.PUBLISHED,
        createdBy: fallbackUserId,
      },
      {
        title: 'Object Tracking',
        description: 'Smooth ocular pursuit and visual attention drills with colorful high-contrast moving targets.',
        instructions: [
          'Hold a bright target object approximately 30cm from the child face.',
          'Move the target slowly in horizontal, vertical, and circular arcs.',
          'Encourage the child to track smoothly with eyes while keeping head still.',
        ],
        category: 'Cognitive',
        skillAreas: ['Visual Tracking', 'Attention', 'Cognitive Focus'],
        difficulty: ExerciseDifficulty.EASY,
        durationMinutes: 3,
        minAge: 1,
        maxAge: 8,
        ageUnit: AgeUnit.YEARS,
        recommended: false,
        color: 'text-accent',
        bg: 'bg-accent/10',
        media: {
          originalFilename: 'object-tracking-drills.mp4',
          s3Key: 'exercise-videos/seed-object-tracking.mp4',
          processedKey: 'processed-exercises/seed-object-tracking-720p.mp4',
          thumbnailKey: 'exercise-thumbnails/seed-object-tracking.jpg',
          thumbnailUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600',
          mimeType: 'video/mp4',
          fileSize: 12400000,
          processedFileSize: 7800000,
          durationSeconds: 180,
          resolution: '720p',
          status: VideoProcessingStatus.READY,
          uploadTimestamp: new Date(),
          processedTimestamp: new Date(),
        },
        status: ExerciseStatus.PUBLISHED,
        createdBy: fallbackUserId,
      },
      {
        title: 'Crossed Leg Stretches',
        description: 'Gentle bilateral midline crossing and lower-extremity flexibility exercises.',
        instructions: [
          'Guide the child to sit cross-legged comfortably on a mat with posture erect.',
          'Hold each gentle stretch for 15-20 seconds with soft breathing.',
          'Switch top leg and repeat 3 repetitions per side.',
        ],
        category: 'Motor',
        skillAreas: ['Gross Motor', 'Coordination', 'Flexibility'],
        difficulty: ExerciseDifficulty.EASY,
        durationMinutes: 8,
        minAge: 2,
        maxAge: 12,
        ageUnit: AgeUnit.YEARS,
        recommended: false,
        color: 'text-primary',
        bg: 'bg-primary/10',
        media: {
          originalFilename: 'crossed-leg-stretches.mp4',
          s3Key: 'exercise-videos/seed-crossed-stretches.mp4',
          processedKey: 'processed-exercises/seed-crossed-stretches-720p.mp4',
          thumbnailKey: 'exercise-thumbnails/seed-crossed-stretches.jpg',
          thumbnailUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600',
          mimeType: 'video/mp4',
          fileSize: 19800000,
          processedFileSize: 13500000,
          durationSeconds: 480,
          resolution: '720p',
          status: VideoProcessingStatus.READY,
          uploadTimestamp: new Date(),
          processedTimestamp: new Date(),
        },
        status: ExerciseStatus.PUBLISHED,
        createdBy: fallbackUserId,
      },
      {
        title: 'Sensory Integration Basics',
        description: 'Comprehensive occupational therapy routine introducing multi-sensory grounding and tactile exploration.',
        instructions: [
          'Prepare sensory texture bins with varying tactile materials.',
          'Introduce each texture gradually allowing self-paced discovery.',
          'Accompany with gentle rhythm and auditory calming cues.',
        ],
        category: 'Occupational Therapy',
        skillAreas: ['Sensory Processing', 'Fine Motor', 'Tactile Discrimination'],
        difficulty: ExerciseDifficulty.EASY,
        durationMinutes: 13,
        minAge: 3,
        maxAge: 6,
        ageUnit: AgeUnit.YEARS,
        recommended: true,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100',
        media: {
          originalFilename: 'sensory-integration-basics.mp4',
          s3Key: 'exercise-videos/seed-sensory-basics.mp4',
          processedKey: 'processed-exercises/seed-sensory-basics-720p.mp4',
          thumbnailKey: 'exercise-thumbnails/seed-sensory-basics.jpg',
          thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600',
          mimeType: 'video/mp4',
          fileSize: 32000000,
          processedFileSize: 21000000,
          durationSeconds: 765,
          resolution: '720p',
          status: VideoProcessingStatus.READY,
          uploadTimestamp: new Date(),
          processedTimestamp: new Date(),
        },
        status: ExerciseStatus.PUBLISHED,
        createdBy: fallbackUserId,
      },
      {
        title: 'Speech Intelligibility Drills',
        description: 'Targeted articulatory and oral motor games enhancing phoneme clarity and vocal resonance.',
        instructions: [
          'Sit at eye level in front of a mirror with the child.',
          'Practice exaggerated vowel sounds (Ah-Oh-Ee) with fun vocal games.',
          'Complete 5 repetitions of bilabial consonant pops (Pa-Ba-Ma).',
        ],
        category: 'Speech Therapy',
        skillAreas: ['Communication', 'Speech Clarity', 'Oral Motor'],
        difficulty: ExerciseDifficulty.MEDIUM,
        durationMinutes: 15,
        minAge: 4,
        maxAge: 6,
        ageUnit: AgeUnit.YEARS,
        recommended: true,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
        media: {
          originalFilename: 'speech-intelligibility-drills.mp4',
          s3Key: 'exercise-videos/seed-speech-drills.mp4',
          processedKey: 'processed-exercises/seed-speech-drills-720p.mp4',
          thumbnailKey: 'exercise-thumbnails/seed-speech-drills.jpg',
          thumbnailUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600',
          mimeType: 'video/mp4',
          fileSize: 38000000,
          processedFileSize: 24500000,
          durationSeconds: 900,
          resolution: '720p',
          status: VideoProcessingStatus.READY,
          uploadTimestamp: new Date(),
          processedTimestamp: new Date(),
        },
        status: ExerciseStatus.PUBLISHED,
        createdBy: fallbackUserId,
      },
      {
        title: 'Core Strengthening',
        description: 'Playful physical exercise routine focusing on abdominal, spinal, and pelvis stabilization.',
        instructions: [
          'Practice superman poses lying prone on the mat for 5 seconds.',
          'Engage in bridge lifts with a small yoga ball between knees.',
          'Finish with animal walks (bear walk, crab walk) across the room.',
        ],
        category: 'Physical Exercise',
        skillAreas: ['Gross Motor', 'Core Stability', 'Endurance'],
        difficulty: ExerciseDifficulty.MEDIUM,
        durationMinutes: 11,
        minAge: 7,
        maxAge: 12,
        ageUnit: AgeUnit.YEARS,
        recommended: false,
        color: 'text-amber-600',
        bg: 'bg-amber-100',
        media: {
          originalFilename: 'core-strengthening.mp4',
          s3Key: 'exercise-videos/seed-core-strength.mp4',
          processedKey: 'processed-exercises/seed-core-strength-720p.mp4',
          thumbnailKey: 'exercise-thumbnails/seed-core-strength.jpg',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544640808-32caaefce5ed?auto=format&fit=crop&q=80&w=600',
          mimeType: 'video/mp4',
          fileSize: 28000000,
          processedFileSize: 18000000,
          durationSeconds: 630,
          resolution: '720p',
          status: VideoProcessingStatus.READY,
          uploadTimestamp: new Date(),
          processedTimestamp: new Date(),
        },
        status: ExerciseStatus.PUBLISHED,
        createdBy: fallbackUserId,
      },
      {
        title: 'Emotional Regulation',
        description: 'Mindful breathing, emotional thermometer check-ins, and progressive muscle relaxation.',
        instructions: [
          'Guide the 4-7-8 rainbow breathing exercise using visual cues.',
          'Identify current feelings on the visual emotion wheel.',
          'Practice squeeze-and-release muscle clenches from toes to shoulders.',
        ],
        category: 'Behavioral Therapy',
        skillAreas: ['Emotional Regulation', 'Attention', 'Self-Soothing'],
        difficulty: ExerciseDifficulty.EASY,
        durationMinutes: 20,
        minAge: 4,
        maxAge: 8,
        ageUnit: AgeUnit.YEARS,
        recommended: false,
        color: 'text-rose-600',
        bg: 'bg-rose-100',
        media: {
          originalFilename: 'emotional-regulation.mp4',
          s3Key: 'exercise-videos/seed-emotional-regulation.mp4',
          processedKey: 'processed-exercises/seed-emotional-regulation-720p.mp4',
          thumbnailKey: 'exercise-thumbnails/seed-emotional-regulation.jpg',
          thumbnailUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600',
          mimeType: 'video/mp4',
          fileSize: 42000000,
          processedFileSize: 27000000,
          durationSeconds: 1215,
          resolution: '720p',
          status: VideoProcessingStatus.READY,
          uploadTimestamp: new Date(),
          processedTimestamp: new Date(),
        },
        status: ExerciseStatus.PUBLISHED,
        createdBy: fallbackUserId,
      },
    ];

    await this.exerciseModel.insertMany(initialExercises);
    this.logger.log(`Seeded ${initialExercises.length} default clinical exercises and categories.`);

    return { seeded: true, count: initialExercises.length };
  }
}
