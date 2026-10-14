import React, { useState, useEffect } from 'react';
import { 
  X, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, 
  Baby, User, Loader2, RotateCw 
} from 'lucide-react';
import { adminDietApi } from '../services/adminDietApi';

export const DietConflictsModal = ({ isOpen, onClose, onResolved }) => {
  const [conflicts, setConflicts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Switch Template state
  const [switchTargetId, setSwitchTargetId] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadConflictsAndTemplates();
    }
  }, [isOpen]);

  const loadConflictsAndTemplates = async () => {
    try {
      setLoading(true);
      const [cRes, tRes] = await Promise.all([
        adminDietApi.getConflicts(),
        adminDietApi.getTemplates(),
      ]);
      if (cRes.success) setConflicts(cRes.data || []);
      if (tRes.success) setTemplates(tRes.data || []);
    } catch (err) {
      console.error('Failed to load conflicts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (assignmentId, action, newDietTemplateId) => {
    try {
      setActionLoadingId(assignmentId);
      const res = await adminDietApi.resolveConflict(assignmentId, {
        action,
        newDietTemplateId,
        notes: action === 'OVERRIDE_CLINICAL' 
          ? 'Approved after clinical allergy review' 
          : action === 'CANCEL_ASSIGNMENT'
          ? 'Cancelled due to patient safety allergy conflict'
          : 'Reassigned to alternative safe nutritional template',
      });

      if (res.success) {
        setConflicts((prev) => prev.filter((c) => c.assignmentId !== assignmentId));
        if (onResolved) onResolved('Allergy conflict resolved successfully');
      }
    } catch (err) {
      console.error('Resolution error:', err);
      alert(err.message || 'Failed to resolve conflict');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-black text-text tracking-tight">
                Resolve Diet Assignment Conflicts
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Investigate and resolve critical food-allergen conflicts between patient charts and assigned meal plans.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1 custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-amber-600 mb-2" />
              <p className="text-xs font-bold">Scanning patient allergy charts...</p>
            </div>
          ) : conflicts.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-text mb-1">No Active Allergy Conflicts</h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                All currently active diet assignments are safely aligned with children's documented allergy records.
              </p>
            </div>
          ) : (
            conflicts.map((item) => (
              <div
                key={item.assignmentId}
                className="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-4 shadow-xs"
              >
                {/* Conflict Banner */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      Safety Alert
                    </span>
                    <h4 className="text-base font-bold text-text mt-1">
                      {item.childName} ({item.childAge})
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Parent: <strong>{item.parentName}</strong> • {item.parentContact}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-gray-500 font-mono block">Assigned Template</span>
                    <span className="text-sm font-bold text-text">{item.dietTemplateName}</span>
                  </div>
                </div>

                {/* Conflict Detail Box */}
                <div className="p-3 bg-white rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Detected Allergen Conflict:</strong> {item.conflictReason}
                    <div className="text-gray-500 mt-1">
                      Documented child allergies: <span className="font-mono font-bold text-rose-600">{item.allergies}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-200/60">
                  <div className="flex items-center gap-2">
                    <select
                      value={switchTargetId[item.assignmentId] || ''}
                      onChange={(e) =>
                        setSwitchTargetId((prev) => ({ ...prev, [item.assignmentId]: e.target.value }))
                      }
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none"
                    >
                      <option value="">Switch to Safe Template...</option>
                      {templates
                        .filter((t) => t.id !== item.dietTemplateId)
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.age})
                          </option>
                        ))}
                    </select>

                    <button
                      type="button"
                      disabled={!switchTargetId[item.assignmentId] || actionLoadingId === item.assignmentId}
                      onClick={() =>
                        handleResolve(item.assignmentId, 'SWITCH_TEMPLATE', switchTargetId[item.assignmentId])
                      }
                      className="px-3 py-1.5 bg-blue-50 text-primary border border-blue-200 hover:bg-blue-100 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
                    >
                      Switch Plan
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={actionLoadingId === item.assignmentId}
                      onClick={() => handleResolve(item.assignmentId, 'OVERRIDE_CLINICAL')}
                      className="px-3 py-1.5 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Clinical Override
                    </button>

                    <button
                      type="button"
                      disabled={actionLoadingId === item.assignmentId}
                      onClick={() => handleResolve(item.assignmentId, 'CANCEL_ASSIGNMENT')}
                      className="px-3.5 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-sm cursor-pointer"
                    >
                      {actionLoadingId === item.assignmentId ? 'Resolving...' : 'Cancel Assignment'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-xs font-mono font-bold text-gray-500">
            {conflicts.length} Unresolved Conflict(s)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-text rounded-xl text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
