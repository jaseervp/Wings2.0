import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  Plus,
  PlayCircle,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  ChevronRight,
  Clock,
  Send,
} from 'lucide-react';
import { adminExerciseApi } from '../services/adminExerciseApi';
import { adminChildrenApi } from '../services/adminChildrenApi';

export const ViewProgramTemplatesModal = ({
  isOpen,
  onClose,
  onCreateNew,
}) => {
  const [templates, setTemplates] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDuration, setFilterDuration] = useState('ALL');

  // Assigning state
  const [assigningTemplate, setAssigningTemplate] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState('');

  const loadTemplatesAndChildren = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tempRes, childRes] = await Promise.all([
        adminExerciseApi.getTemplates(),
        adminChildrenApi.getChildren({ limit: 100 }).catch(() => ({ data: { children: [] } })),
      ]);

      let list = tempRes.data || [];
      if (list.length === 0) {
        // Auto-seed defaults if empty
        const seedRes = await adminExerciseApi.seedTemplatesDefaults();
        if (seedRes.seeded) {
          const reload = await adminExerciseApi.getTemplates();
          list = reload.data || [];
        }
      }

      setTemplates(list);

      const kids = childRes.data?.children || childRes.data || [];
      setChildren(kids);
      if (kids.length > 0) {
        setSelectedChildId(kids[0]._id);
      }
    } catch (err) {
      console.error('Failed to load templates:', err);
      setError(err.message || 'Failed to load structured programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadTemplatesAndChildren();
      setAssigningTemplate(null);
      setAssignSuccess('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTemplates = templates.filter((t) => {
    if (filterDuration === 'ALL') return true;
    return String(t.durationDays) === String(filterDuration);
  });

  const handleStartAssign = (template) => {
    setAssigningTemplate(template);
    setAssignSuccess('');
  };

  const handleConfirmAssign = async (e) => {
    e.preventDefault();
    if (!selectedChildId || !assigningTemplate) return;

    try {
      setIsAssigning(true);
      await adminExerciseApi.assignTemplate(assigningTemplate._id, {
        childId: selectedChildId,
        startDate,
      });

      setAssignSuccess(`Program "${assigningTemplate.title}" assigned successfully!`);
      setTimeout(() => {
        setAssigningTemplate(null);
        setAssignSuccess('');
        loadTemplatesAndChildren();
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to assign program.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDeleteTemplate = async (id, title) => {
    if (!window.confirm(`Delete program template "${title}"?`)) return;
    try {
      await adminExerciseApi.deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete template.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col"
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
                Structured Exercise Programs & Routines
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Multi-day therapeutic protocols ready for 1-click child assignment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onCreateNew) onCreateNew();
              }}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create New Program
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 border-b border-gray-100 bg-white flex items-center gap-2 text-xs font-bold text-gray-600">
          <span className="text-gray-400 mr-2">Duration:</span>
          {['ALL', '7', '14', '30'].map((d) => (
            <button
              key={d}
              onClick={() => setFilterDuration(d)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterDuration === d
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {d === 'ALL' ? 'All Durations' : `${d} Days`}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Loading program templates...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center max-w-sm mx-auto space-y-2">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-sm font-bold text-gray-800">{error}</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-primary flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-gray-700">No Program Templates Found</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Create a sequential 7-day or 30-day routine to quickly assign structured exercises.
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onCreateNew) onCreateNew();
                }}
                className="mt-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-sm"
              >
                Create Program Template
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template._id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-extrabold rounded-lg border border-blue-100">
                        {template.durationDays} Days Routine
                      </span>
                      <span className="text-[11px] font-bold text-gray-400 uppercase">
                        {template.category}
                      </span>
                    </div>

                    <h4 className="font-admin-heading font-black text-text text-base leading-snug mb-1">
                      {template.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                      {template.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium py-2 border-t border-b border-gray-50 mb-4">
                      <span>
                        Ages: <strong>{template.minAge}-{template.maxAge} Yrs</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Difficulty: <strong>{template.difficulty}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Videos: <strong>{template.exerciseIds?.length || 0}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleStartAssign(template)}
                      className="flex-1 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-sm shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Assign to Child
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template._id, template.title)}
                      className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Assign Drawer / Dialog */}
          {assigningTemplate && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div
                className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h4 className="font-bold text-text text-base">Assign Structured Program</h4>
                    <p className="text-xs text-primary font-semibold truncate max-w-xs">
                      {assigningTemplate.title} ({assigningTemplate.durationDays} Days)
                    </p>
                  </div>
                  <button
                    onClick={() => setAssigningTemplate(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {assignSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{assignSuccess}</span>
                  </div>
                ) : (
                  <form onSubmit={handleConfirmAssign} className="space-y-4 text-xs font-bold">
                    <div className="space-y-1.5">
                      <label className="text-gray-600">Select Child Profile *</label>
                      <select
                        value={selectedChildId}
                        onChange={(e) => setSelectedChildId(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none"
                      >
                        {children.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.firstName} {c.lastName} ({c.gender})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-600">Program Start Date *</label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none"
                      />
                    </div>

                    <p className="text-[11px] text-gray-400 font-normal leading-relaxed">
                      This will schedule daily exercises across {assigningTemplate.durationDays} consecutive
                      days on the child's daily activity calendar.
                    </p>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setAssigningTemplate(null)}
                        className="flex-1 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isAssigning}
                        className="flex-1 py-2 bg-primary text-white rounded-xl shadow-md hover:bg-primary/90 flex items-center justify-center gap-1.5"
                      >
                        {isAssigning ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Confirm & Assign'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProgramTemplatesModal;
