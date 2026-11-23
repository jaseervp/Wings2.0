import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Search,
  User,
  Clock,
  Check,
} from 'lucide-react';
import { adminChildrenApi } from '../services/adminChildrenApi';
import { adminExerciseApi } from '../services/adminExerciseApi';

export const ExerciseAssignmentModal = ({
  isOpen,
  onClose,
  preselectedExerciseId = null,
  onSuccess,
}) => {
  const [children, setChildren] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Selected values
  const [selectedChildId, setSelectedChildId] = useState('');
  const [selectedExerciseIds, setSelectedExerciseIds] = useState([]);
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('09:00 AM');
  const [notes, setNotes] = useState('');
  const [therapistApproved, setTherapistApproved] = useState(true);

  // Recommendations preview
  const [recommendedList, setRecommendedList] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const [childrenRes, exercisesRes] = await Promise.all([
          adminChildrenApi.getChildren({ limit: 100 }).catch(() => ({ data: { children: [] } })),
          adminExerciseApi.getExercises({ limit: 100 }),
        ]);

        const kids = childrenRes.data?.children || childrenRes.data || [];
        setChildren(kids);
        if (kids.length > 0 && !selectedChildId) {
          setSelectedChildId(kids[0]._id);
        }

        const exs = exercisesRes.data?.items || exercisesRes.data || [];
        setExercises(exs);

        if (preselectedExerciseId) {
          setSelectedExerciseIds([preselectedExerciseId]);
        } else if (exs.length > 0) {
          setSelectedExerciseIds([exs[0]._id]);
        }
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load children or exercises.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, preselectedExerciseId]);

  if (!isOpen) return null;

  const toggleExerciseSelection = (id) => {
    if (selectedExerciseIds.includes(id)) {
      setSelectedExerciseIds(selectedExerciseIds.filter((exId) => exId !== id));
    } else {
      setSelectedExerciseIds([...selectedExerciseIds, id]);
    }
  };

  const handlePreviewRecommendations = async () => {
    if (!selectedChildId) return;
    try {
      setPreviewing(true);
      const res = await adminExerciseApi.previewAssignments(selectedChildId);
      const recs = res.data?.recommendedExercises || [];
      setRecommendedList(recs);
      if (recs.length > 0) {
        setSelectedExerciseIds(recs.map((r) => r._id));
      }
    } catch (err) {
      console.error('Preview recommendations error:', err);
    } finally {
      setPreviewing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedChildId) {
      setErrorMessage('Please select a child profile.');
      return;
    }
    if (selectedExerciseIds.length === 0) {
      setErrorMessage('Please select at least one exercise to assign.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      await adminExerciseApi.assignExercises({
        childIds: [selectedChildId],
        exerciseIds: selectedExerciseIds,
        scheduledDate,
        scheduledTime,
        therapistApproved,
        notes,
      });

      setSuccessMessage('Activities successfully assigned to child!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to assign activities.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedChild = children.find((c) => c._id === selectedChildId);

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
                Assign Exercise Routine
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Assign structured therapeutic activities to a child profile.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading clinical records...</p>
          </div>
        ) : (
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

            {/* Select Child */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Target Child Profile *
                </label>
                {selectedChild && (
                  <button
                    type="button"
                    onClick={handlePreviewRecommendations}
                    disabled={previewing}
                    className="text-xs font-bold text-primary hover:text-blue-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {previewing ? 'Evaluating Profile...' : 'Auto-Recommend for Child'}
                  </button>
                )}
              </div>

              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:border-primary outline-none"
              >
                {children.map((child) => (
                  <option key={child._id} value={child._id}>
                    {child.firstName} {child.lastName} ({child.gender}, DOB: {child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString() : 'N/A'})
                  </option>
                ))}
              </select>

              {selectedChild && (
                <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center gap-3 text-xs text-blue-900">
                  <User className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Selected:</strong> {selectedChild.firstName} {selectedChild.lastName}
                    {selectedChild.primaryConcerns && ` • Concerns: ${selectedChild.primaryConcerns}`}
                  </span>
                </div>
              )}
            </div>

            {/* Select Exercises */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Select Exercises ({selectedExerciseIds.length} chosen)
              </label>

              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-100 rounded-2xl p-2 bg-gray-50/30">
                {exercises.map((ex) => {
                  const isSelected = selectedExerciseIds.includes(ex._id);
                  return (
                    <div
                      key={ex._id}
                      onClick={() => toggleExerciseSelection(ex._id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-200 text-blue-950 font-bold'
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

            {/* Schedule Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:border-primary outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Target Time
                </label>
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  placeholder="e.g. 09:00 AM"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:border-primary outline-none"
                />
              </div>
            </div>

            {/* Instructions / Clinical Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Therapist Notes / Guidance
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special notes for parents during this routine..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:border-primary outline-none resize-none"
              />
            </div>

            {/* Therapist Approval Checkbox */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <input
                type="checkbox"
                id="therapist-approved-check"
                checked={therapistApproved}
                onChange={(e) => setTherapistApproved(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <label htmlFor="therapist-approved-check" className="text-sm font-bold text-gray-800 cursor-pointer">
                Therapist Approved (Clinically validated for this child)
              </label>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Assigning...
                  </>
                ) : (
                  'Assign Activities'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ExerciseAssignmentModal;
