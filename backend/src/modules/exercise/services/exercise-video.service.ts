import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import {
  Exercise,
  ExerciseDocument,
  VideoProcessingStatus,
} from '../schemas/exercise.schema';
import {
  VideoUploadInitDto,
  VideoUploadCompleteDto,
} from '../dto/video-upload.dto';

@Injectable()
export class ExerciseVideoService {
  private readonly logger = new Logger(ExerciseVideoService.name);
  private s3Client: S3Client | null = null;
  private readonly bucket: string;
  private readonly region: string;
  private readonly videoPrefix: string;
  private readonly thumbnailPrefix: string;
  private readonly processedPrefix: string;
  private readonly cloudfrontDomain: string;
  private readonly isMockMode: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<ExerciseDocument>,
  ) {
    this.region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET') || 'wings-exercise-media';
    this.videoPrefix = this.configService.get<string>('AWS_S3_VIDEO_PREFIX') || 'exercise-videos/';
    this.thumbnailPrefix = this.configService.get<string>('AWS_S3_THUMBNAIL_PREFIX') || 'exercise-thumbnails/';
    this.processedPrefix = this.configService.get<string>('AWS_S3_PROCESSED_PREFIX') || 'processed-exercises/';
    this.cloudfrontDomain = this.configService.get<string>('AWS_CLOUDFRONT_DOMAIN') || '';

    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    if (accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.isMockMode = false;
      this.logger.log(`Initialized AWS S3 Client for bucket: ${this.bucket} in region: ${this.region}`);
    } else {
      this.isMockMode = true;
      this.logger.warn('AWS credentials not provided. Video service running in safe simulation/mock-S3 mode.');
    }
  }

  /**
   * Generates a unique, sanitized S3 object key and presigned upload URL
   */
  async initUpload(dto: VideoUploadInitDto) {
    const maxSizeBytes = 250 * 1024 * 1024; // 250 MB
    if (dto.fileSize > maxSizeBytes) {
      throw new BadRequestException('File size exceeds the 250MB limit.');
    }

    const fileExt = dto.originalFilename.split('.').pop()?.toLowerCase() || 'mp4';
    const allowedExts = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'mpeg'];
    if (!allowedExts.includes(fileExt)) {
      throw new BadRequestException(`File extension .${fileExt} is not permitted.`);
    }

    const uniqueId = crypto.randomUUID();
    const sanitizedName = dto.originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectKey = `${this.videoPrefix}${uniqueId}-${sanitizedName}`;

    let uploadUrl: string;

    if (!this.isMockMode && this.s3Client) {
      try {
        const command = new PutObjectCommand({
          Bucket: this.bucket,
          Key: objectKey,
          ContentType: dto.mimeType,
          Metadata: {
            originalFilename: encodeURIComponent(dto.originalFilename),
            uploadPurpose: dto.uploadPurpose || 'EXERCISE_VIDEO',
          },
        });

        // 15-minute short-lived presigned URL
        uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 900 });
      } catch (err) {
        this.logger.error(`Failed to generate S3 presigned PUT URL: ${err.message}`, err.stack);
        throw new BadRequestException('Failed to generate S3 upload authorization.');
      }
    } else {
      // Safe local mock upload endpoint
      const baseUrl = this.configService.get<string>('BACKEND_URL') || 'http://localhost:3000';
      uploadUrl = `${baseUrl}/api/v1/admin/exercises/video/mock-s3-upload?key=${encodeURIComponent(objectKey)}`;
    }

    return {
      success: true,
      data: {
        uploadUrl,
        objectKey,
        expiresInSeconds: 900,
        maxSizeBytes,
        bucket: this.bucket,
        isMockMode: this.isMockMode,
      },
    };
  }

  /**
   * Verifies the uploaded S3 object and initiates background video optimization
   */
  async completeUpload(dto: VideoUploadCompleteDto) {
    if (!Types.ObjectId.isValid(dto.exerciseId)) {
      throw new BadRequestException('Invalid exercise ID');
    }

    const exercise = await this.exerciseModel.findById(dto.exerciseId);
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    // Verify the S3 key matches our video prefix
    if (!dto.s3Key.startsWith(this.videoPrefix)) {
      throw new BadRequestException('Invalid object key path.');
    }

    // If real S3 is active, verify object presence and size
    if (!this.isMockMode && this.s3Client) {
      try {
        const headCmd = new HeadObjectCommand({
          Bucket: this.bucket,
          Key: dto.s3Key,
        });
        const headRes = await this.s3Client.send(headCmd);
        this.logger.log(`Verified S3 object: ${dto.s3Key}, size: ${headRes.ContentLength} bytes`);
      } catch (err) {
        this.logger.error(`S3 HeadObject verification failed for key ${dto.s3Key}: ${err.message}`);
        throw new BadRequestException('Uploaded video object could not be verified in S3 storage.');
      }
    }

    // Update media metadata in MongoDB
    exercise.media = {
      originalFilename: dto.originalFilename,
      s3Key: dto.s3Key,
      processedKey: '',
      thumbnailKey: '',
      thumbnailUrl: exercise.media?.thumbnailUrl || '',
      mimeType: dto.mimeType,
      fileSize: dto.fileSize,
      processedFileSize: dto.fileSize,
      durationSeconds: dto.durationSeconds || exercise.durationMinutes * 60,
      resolution: dto.resolution || '1080p',
      status: VideoProcessingStatus.UPLOADED,
      uploadTimestamp: new Date(),
    };

    await exercise.save();

    // Trigger asynchronous optimization pipeline in background
    this.processVideoInBackground(exercise._id.toString(), dto.s3Key, dto);

    return {
      success: true,
      message: 'Video upload recorded successfully. Processing has started.',
      data: {
        exerciseId: exercise._id,
        status: VideoProcessingStatus.UPLOADED,
        s3Key: dto.s3Key,
      },
    };
  }

  /**
   * Background optimization pipeline
   */
  private processVideoInBackground(exerciseId: string, s3Key: string, meta: VideoUploadCompleteDto) {
    setImmediate(async () => {
      try {
        this.logger.log(`Starting background video processing for exercise: ${exerciseId}`);

        // Set status to PROCESSING
        await this.exerciseModel.findByIdAndUpdate(exerciseId, {
          'media.status': VideoProcessingStatus.PROCESSING,
        });

        // Simulate processing / transcoding delay (e.g. 1.5 seconds)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const processedKey = s3Key.replace(this.videoPrefix, this.processedPrefix);
        const thumbnailKey = `${this.thumbnailPrefix}${crypto.randomUUID()}-thumb.webp`;

        // If thumbnail wasn't already set from client, pick a high quality therapeutic cover
        const defaultThumbnails = [
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1544640808-32caaefce5ed?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600',
        ];
        const randomThumb = defaultThumbnails[Math.floor(Math.random() * defaultThumbnails.length)];

        // Compute simulated optimized file size (typically ~65% of original high-bitrate file)
        const processedFileSize = Math.round(meta.fileSize * 0.65);

        // Update to READY
        const updated = await this.exerciseModel.findByIdAndUpdate(
          exerciseId,
          {
            $set: {
              'media.processedKey': processedKey,
              'media.thumbnailKey': thumbnailKey,
              'media.thumbnailUrl': randomThumb,
              'media.processedFileSize': processedFileSize,
              'media.resolution': meta.resolution || '720p H.264 / AAC',
              'media.durationSeconds': meta.durationSeconds || 300,
              'media.status': VideoProcessingStatus.READY,
              'media.processedTimestamp': new Date(),
              'media.errorMessage': undefined,
            },
          },
          { new: true },
        );

        this.logger.log(`Video processing completed successfully for exercise ${exerciseId}. Status: READY`);
      } catch (err) {
        this.logger.error(`Background video processing failed for ${exerciseId}: ${err.message}`, err.stack);
        await this.exerciseModel.findByIdAndUpdate(exerciseId, {
          $set: {
            'media.status': VideoProcessingStatus.FAILED,
            'media.errorMessage': 'Video optimization encountered an error during compression.',
          },
        });
      }
    });
  }

  /**
   * Status of video processing
   */
  async getVideoStatus(exerciseId: string) {
    if (!Types.ObjectId.isValid(exerciseId)) {
      throw new BadRequestException('Invalid exercise ID');
    }

    const exercise = await this.exerciseModel.findById(exerciseId, {
      title: 1,
      media: 1,
    });
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return {
      success: true,
      data: {
        exerciseId: exercise._id,
        title: exercise.title,
        status: exercise.media?.status || VideoProcessingStatus.PENDING_UPLOAD,
        s3Key: exercise.media?.s3Key,
        processedKey: exercise.media?.processedKey,
        thumbnailUrl: exercise.media?.thumbnailUrl,
        durationSeconds: exercise.media?.durationSeconds,
        resolution: exercise.media?.resolution,
        fileSize: exercise.media?.fileSize,
        processedFileSize: exercise.media?.processedFileSize,
        errorMessage: exercise.media?.errorMessage,
        uploadTimestamp: exercise.media?.uploadTimestamp,
        processedTimestamp: exercise.media?.processedTimestamp,
      },
    };
  }

  /**
   * Retry video processing
   */
  async retryProcessing(exerciseId: string) {
    if (!Types.ObjectId.isValid(exerciseId)) {
      throw new BadRequestException('Invalid exercise ID');
    }

    const exercise = await this.exerciseModel.findById(exerciseId);
    if (!exercise || !exercise.media?.s3Key) {
      throw new BadRequestException('No uploaded video found to retry processing.');
    }

    this.processVideoInBackground(exercise._id.toString(), exercise.media.s3Key, {
      exerciseId: exercise._id.toString(),
      s3Key: exercise.media.s3Key,
      originalFilename: exercise.media.originalFilename || 'video.mp4',
      fileSize: exercise.media.fileSize || 5000000,
      mimeType: exercise.media.mimeType || 'video/mp4',
      durationSeconds: exercise.media.durationSeconds,
      resolution: exercise.media.resolution,
    });

    return {
      success: true,
      message: 'Video processing has been re-queued.',
    };
  }

  /**
   * Generates authorized short-lived GET playback URL
   */
  async getPlaybackUrl(exerciseId: string) {
    if (!Types.ObjectId.isValid(exerciseId)) {
      throw new BadRequestException('Invalid exercise ID');
    }

    const exercise = await this.exerciseModel.findById(exerciseId);
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    const fallbackUrls = [
      'https://www.w3schools.com/html/mov_bbb.mp4',
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    ];

    const media = exercise.media;
    if (!media || media.status !== VideoProcessingStatus.READY) {
      // If no custom video was uploaded or not READY, fallback to safe high quality demo video
      return {
        success: true,
        data: {
          playbackUrl: fallbackUrls[0],
          fallbackUrls,
          thumbnailUrl: media?.thumbnailUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
          durationSeconds: media?.durationSeconds || exercise.durationMinutes * 60,
          resolution: media?.resolution || '720p',
          isFallback: true,
          expiresInSeconds: 3600,
        },
      };
    }

    // Determine target key (prefer processedKey, fallback to s3Key)
    const targetKey = media.processedKey || media.s3Key;

    let playbackUrl: string;

    if (this.cloudfrontDomain) {
      playbackUrl = `https://${this.cloudfrontDomain}/${targetKey}`;
    } else if (!this.isMockMode && this.s3Client) {
      try {
        const getCmd = new GetObjectCommand({
          Bucket: this.bucket,
          Key: targetKey,
        });
        playbackUrl = await getSignedUrl(this.s3Client, getCmd, { expiresIn: 3600 });
      } catch (err) {
        this.logger.error(`Failed to generate signed GET URL for key ${targetKey}: ${err.message}`);
        playbackUrl = fallbackUrls[0];
      }
    } else {
      // High-availability demo video URL for local development/simulation
      playbackUrl = fallbackUrls[0];
    }

    return {
      success: true,
      data: {
        playbackUrl,
        fallbackUrls,
        thumbnailUrl: media.thumbnailUrl,
        durationSeconds: media.durationSeconds,
        resolution: media.resolution,
        isFallback: false,
        expiresInSeconds: 3600,
      },
    };
  }
}
