import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Video,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { adminExerciseApi } from '../services/adminExerciseApi';

export const ExerciseFormModal = ({
  isOpen,
  onClose,
  exercise = null,
  categories = [],
  onSuccess,
}) => {
  const isEdit = !!exercise?._id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Sensory',
    difficulty: 'EASY',
    durationMinutes: 5,
    minAge: 2,
    maxAge: 12,
    ageUnit: 'YEARS',
    recommended: false,
    thumbnailUrl: '',
    instructions: [''],
  });

  // Video upload state
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState('IDLE'); // 'IDLE', 'UPLOADING', 'UPLOADED', 'PROCESSING', 'READY', 'FAILED'
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedS3Key, setUploadedS3Key] = useState('');

  useEffect(() => {
    if (exercise) {
      setFormData({
        title: exercise.title || '',
        description: exercise.description || '',
        category: exercise.category || (categories[0]?.name || 'Sensory'),
        difficulty: exercise.difficulty || 'EASY',
        durationMinutes: exercise.durationMinutes || 5,
        minAge: exercise.minAge ?? 2,
        maxAge: exercise.maxAge ?? 12,
        ageUnit: exercise.ageUnit || 'YEARS',
        recommended: exercise.recommended || false,
        thumbnailUrl: exercise.media?.thumbnailUrl || '',
        instructions: exercise.instructions?.length ? exercise.instructions : [''],
      });
      if (exercise.media?.status) {
        setUploadState(exercise.media.status);
        setUploadedS3Key(exercise.media.s3Key || '');
      }
    } else {
      setFormData({
        title: '',
        description: '',
        category: categories[0]?.name || 'Sensory',
        difficulty: 'EASY',
        durationMinutes: 5,
        minAge: 2,
        maxAge: 12,
        ageUnit: 'YEARS',
        recommended: false,
        thumbnailUrl: '',
        instructions: [''],
      });
      setVideoFile(null);
      setUploadProgress(0);
      setUploadState('IDLE');
      setUploadedS3Key('');
    }
    setErrorMessage('');
  }, [exercise, isOpen, categories]);

  if (!isOpen) return null;

  const handleInstructionChange = (index, value) => {
    const next = [...formData.instructions];
    next[index] = value;
    setFormData({ ...formData, instructions: next });
  };

  const addInstruction = () => {
    setFormData({ ...formData, instructions: [...formData.instructions, ''] });
  };

  const removeInstruction = (index) => {
    if (formData.instructions.length <= 1) return;
    const next = formData.instructions.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: next });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Please select a valid MP4, WebM, or MOV video file.');
      return;
    }

    if (file.size > 250 * 1024 * 1024) {
      setErrorMessage('File size exceeds 250MB limit.');
      return;
    }

    setErrorMessage('');
    setVideoFile(file);
    setUploadProgress(0);
    setUploadState('READY_TO_UPLOAD');
  };

  const handleUploadVideo = async (targetExerciseId) => {
    if (!videoFile) return;

    try {
      setUploadState('UPLOADING');
      setUploadProgress(5);

      // 1. Init upload: get presigned S3 PUT URL
      const initRes = await adminExerciseApi.initVideoUpload({
        originalFilename: videoFile.name,
        mimeType: videoFile.type,
        fileSize: videoFile.size,
        exerciseId: targetExerciseId,
      });

      const { uploadUrl, objectKey } = initRes.data;
      setUploadedS3Key(objectKey);

      // 2. Direct upload to S3 with progress
      await adminExerciseApi.uploadFileToS3(uploadUrl, videoFile, (percent) => {
        setUploadProgress(percent);
      });

      setUploadState('UPLOADED');
      setUploadProgress(100);

      // 3. Complete upload and trigger background processing
      await adminExerciseApi.completeVideoUpload({
        exerciseId: targetExerciseId,
        s3Key: objectKey,
        originalFilename: videoFile.name,
        fileSize: videoFile.size,
        mimeType: videoFile.type,
        durationSeconds: formData.durationMinutes * 60,
      });

      setUploadState('PROCESSING');

      // Poll for processing completion
      let attempts = 0;
      const pollTimer = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await adminExerciseApi.getVideoStatus(targetExerciseId);
          if (statusRes.data?.status === 'READY') {
            setUploadState('READY');
            if (statusRes.data.thumbnailUrl) {
              setFormData((prev) => ({ ...prev, thumbnailUrl: statusRes.data.thumbnailUrl }));
            }
            clearInterval(pollTimer);
          } else if (statusRes.data?.status === 'FAILED') {
            setUploadState('FAILED');
            setErrorMessage(statusRes.data?.errorMessage || 'Video processing failed.');
            clearInterval(pollTimer);
          }
        } catch (err) {
          console.error('Status poll error:', err);
        }
        if (attempts > 15) {
          clearInterval(pollTimer);
        }
      }, 1000);
    } catch (err) {
      console.error('Video upload failed:', err);
      setUploadState('FAILED');
      setErrorMessage(err.message || 'Failed to upload video to AWS S3.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('Exercise title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMessage('Description is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        difficulty: formData.difficulty,
        durationMinutes: Number(formData.durationMinutes) || 5,
        minAge: Number(formData.minAge) || 2,
        maxAge: Number(formData.maxAge) || 12,
        ageUnit: formData.ageUnit,
        recommended: formData.recommended,
        instructions: formData.instructions.filter((i) => i.trim().length > 0),
        thumbnailUrl: formData.thumbnailUrl || undefined,
      };

      let savedExercise;
      if (isEdit) {
        const res = await adminExerciseApi.updateExercise(exercise._id, payload);
        savedExercise = res.data;
      } else {
        const res = await adminExerciseApi.createExercise(payload);
        savedExercise = res.data;
      }

      // If user selected a new video file, execute upload sequence for this exercise
      if (videoFile && savedExercise?._id) {
        await handleUploadVideo(savedExercise._id);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save exercise.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-xl font-admin-heading font-black text-text">
              {isEdit ? 'Edit Exercise Routine' : 'Upload Video & Create Exercise'}
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Configure exercise metadata, age guidelines, and AWS S3 video content.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Video Upload Dropzone */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Exercise Demonstration Video
            </label>
            <div className="border-2 border-dashed border-gray-200 hover:border-primary/50 rounded-2xl p-6 text-center transition-all bg-gray-50/50">
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileSelect}
                className="hidden"
                id="exercise-video-input"
              />
              <label
                htmlFor="exercise-video-input"
                className="cursor-pointer flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {videoFile ? videoFile.name : 'Click to select or drag video file'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    MP4, WebM or MOV up to 250MB. Uploads directly to private AWS S3.
                  </p>
                </div>
              </label>

              {/* Progress and status indicators */}
              {uploadState === 'UPLOADING' && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>Uploading to AWS S3...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadState === 'PROCESSING' && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center gap-2 text-amber-700 text-xs font-bold">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Optimizing video and generating thumbnail in background...</span>
                </div>
              )}

              {uploadState === 'READY' && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Video optimized and ready for playback!</span>
                </div>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Deep Pressure Therapy"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white outline-none font-medium"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Clinical description of the routine and expected therapeutic benefits..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white outline-none font-medium resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:border-primary outline-none"
              >
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c.slug || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Sensory">Sensory</option>
                    <option value="Motor">Motor</option>
                    <option value="Cognitive">Cognitive</option>
                    <option value="Occupational Therapy">Occupational Therapy</option>
                    <option value="Physical Exercise">Physical Exercise</option>
                    <option value="Speech Therapy">Speech Therapy</option>
                    <option value="Behavioral Therapy">Behavioral Therapy</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:border-primary outline-none"
              >
                <option value="EASY">Low / Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Duration (minutes)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Min Age (Years)
                </label>
                <input
                  type="number"
                  min={0}
                  max={18}
                  value={formData.minAge}
                  onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Max Age (Years)
                </label>
                <input
                  type="number"
                  min={0}
                  max={18}
                  value={formData.maxAge}
                  onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Step-by-Step Instructions
              </label>
              <button
                type="button"
                onClick={addInstruction}
                className="text-xs font-bold text-primary hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>
            {formData.instructions.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 text-xs font-bold text-gray-400 text-center">{idx + 1}.</span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleInstructionChange(idx, e.target.value)}
                  placeholder={`Step ${idx + 1} instruction...`}
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none"
                />
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(idx)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Therapist Pick Toggle */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <input
              type="checkbox"
              id="recommended-check"
              checked={formData.recommended}
              onChange={(e) => setFormData({ ...formData, recommended: e.target.checked })}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="recommended-check" className="text-sm font-bold text-gray-800 cursor-pointer">
              Mark as "Therapist Pick" (Promoted in recommended today)
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : isEdit ? (
                'Save Changes'
              ) : (
                'Publish Exercise'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExerciseFormModal;
