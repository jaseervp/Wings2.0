import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/mpeg',
];

export class VideoUploadInitDto {
  @IsString()
  @IsNotEmpty()
  originalFilename: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(ALLOWED_VIDEO_MIME_TYPES, {
    message: 'MIME type must be one of: video/mp4, video/webm, video/quicktime, video/x-msvideo, video/mpeg',
  })
  mimeType: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  fileSize: number; // in bytes

  @IsString()
  @IsOptional()
  uploadPurpose?: string = 'EXERCISE_VIDEO';

  @IsString()
  @IsOptional()
  exerciseId?: string;
}

export class VideoUploadCompleteDto {
  @IsString()
  @IsNotEmpty()
  exerciseId: string;

  @IsString()
  @IsNotEmpty()
  s3Key: string;

  @IsString()
  @IsNotEmpty()
  originalFilename: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  fileSize: number;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  durationSeconds?: number;

  @IsString()
  @IsOptional()
  resolution?: string;
}
