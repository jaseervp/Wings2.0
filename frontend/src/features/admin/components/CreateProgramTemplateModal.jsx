import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  AlertCircle,
  Loader2,
  Check,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { adminExerciseApi } from '../services/adminExerciseApi';

export const CreateProgramTemplateModal = ({
  isOpen,
  onClose,
  categories = [],
  exercises = [],
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationDays: 7,
    category: 'Sensory',
    difficulty: 'EASY',
    minAge: 3,
    maxAge: 10,
    ageUnit: 'YEARS',
    exerciseIds: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        durationDays: 7,
        category: categories[0]?.name || 'Sensory',
        difficulty: 'EASY',
        minAge: 3,
        maxAge: 10,
        ageUnit: 'YEARS',
        exerciseIds: exercises.slice(0, 3).map((e) => e._id),
      });
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, categories, exercises]);

  if (!isOpen) return null;

  const toggleExercise = (id) => {
    setFormData((prev) => {
      const exists = prev.exerciseIds.includes(id);
      return {
        ...prev,
        exerciseIds: exists
          ? prev.exerciseIds.filter((exId) => exId !== id)
          : [...prev.exerciseIds, id],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('Program title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMessage('Program description is required.');
      return;
    }
    if (formData.exerciseIds.length === 0) {
      setErrorMessage('Please select at least one exercise to include in this program.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      await adminExerciseApi.createTemplate({
        title: formData.title.trim(),
        description: formData.description.trim(),
        durationDays: Number(formData.durationDays) || 7,
        category: formData.category,
        difficulty: formData.difficulty,
        minAge: Number(formData.minAge) || 3,
        maxAge: Number(formData.maxAge) || 10,
        ageUnit: formData.ageUnit,
        exerciseIds: formData.exerciseIds,
      });

      setSuccessMessage('Structured program template created successfully!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 900);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create program template.');
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
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-admin-heading font-black text-text">
                Create Structured Exercise Program
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Design a sequential 7-day or 30-day therapeutic protocol from the library.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
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
          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Program Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Program Template Name *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 7-Day Sensory Integration Protocol"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white outline-none font-medium"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Clinical Objectives & Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Sequential daily routines designed to develop vestibular balance, fine motor coordination, etc..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white outline-none font-medium resize-none"
            />
          </div>

          {/* Duration & Category */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Program Duration *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[7, 14, 21, 30].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setFormData({ ...formData, durationDays: days })}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      formData.durationDays === days
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Primary Category
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
                    <option value="Occupational Therapy">Occupational Therapy</option>
                    <option value="Physical Exercise">Physical Exercise</option>
                    <option value="Speech Therapy">Speech Therapy</option>
                    <option value="Cognitive">Cognitive</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Target Age Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={1}
                  max={18}
                  value={formData.minAge}
                  onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                  placeholder="Min age"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="number"
                  min={1}
                  max={18}
                  value={formData.maxAge}
                  onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
                  placeholder="Max age"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:border-primary outline-none"
              >
                <option value="EASY">Low / Gentle</option>
                <option value="MEDIUM">Medium / Progressive</option>
                <option value="HARD">Advanced</option>
              </select>
            </div>
          </div>

          {/* Group Videos / Exercise Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Select Exercises for Sequential Routine ({formData.exerciseIds.length} chosen)
              </label>
              <span className="text-xs text-gray-400">
                Exercises will be scheduled across the {formData.durationDays} days
              </span>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto border border-gray-100 rounded-2xl p-2 bg-gray-50/40">
              {exercises.map((ex) => {
                const isSelected = formData.exerciseIds.includes(ex._id);
                return (
                  <div
                    key={ex._id}
                    onClick={() => toggleExercise(ex._id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-bold'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-tight">{ex.title}</p>
                        <p className="text-xs text-gray-500 font-normal">
                          {ex.category} • {ex.durationMinutes} min • Ages {ex.minAge}-{ex.maxAge} yrs
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-400">
                      {ex.difficulty}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                'Create Program Template'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProgramTemplateModal;
