import React, { useState, useEffect } from 'react';
import { 
  X, FileText, AlertTriangle, CheckCircle2, Clock, 
  User, Baby, Calendar, MessageSquare, Loader2, Save, 
  ShieldAlert, Sparkles 
} from 'lucide-react';
import { adminAssessmentsApi } from '../services/adminAssessmentsApi';

const ANSWER_BADGES = {
  always: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  often: 'bg-blue-50 text-blue-700 border-blue-200',
  sometimes: 'bg-amber-50 text-amber-700 border-amber-200',
  never: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const ReviewAssessmentModal = ({ isOpen, onClose, assessmentId, onUpdated }) => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review form state
  const [selectedStatus, setSelectedStatus] = useState('REVIEWED');
  const [reviewNotes, setReviewNotes] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Flag state
  const [isFlagged, setIsFlagged] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [submittingFlag, setSubmittingFlag] = useState(false);

  useEffect(() => {
    if (isOpen && assessmentId) {
      loadAssessment();
    }
  }, [isOpen, assessmentId]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminAssessmentsApi.getAssessment(assessmentId);
      if (res.success && res.data) {
        setAssessment(res.data);
        setSelectedStatus(res.data.statusCode === 'IN_PROGRESS' ? 'IN_PROGRESS' : res.data.statusCode);
        setReviewNotes(res.data.reviewNotes || '');
        setIsFlagged(Boolean(res.data.flagged));
        setFlagReason(res.data.flagReason || '');
        setShowFlagInput(Boolean(res.data.flagged));
      } else {
        throw new Error(res.message || 'Failed to load assessment');
      }
    } catch (err) {
      console.error('Error loading assessment details:', err);
      setError(err.message || 'Unable to load assessment records');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReview = async () => {
    try {
      setSubmittingReview(true);
      const res = await adminAssessmentsApi.reviewAssessment(assessment.id, {
        status: selectedStatus,
        reviewNotes: reviewNotes.trim(),
      });
      if (res.success) {
        if (onUpdated) onUpdated(`Assessment status updated to ${selectedStatus === 'REVIEWED' ? 'Reviewed' : selectedStatus}`);
        onClose();
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert(err.message || 'Failed to save review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleToggleFlag = async () => {
    const nextFlagState = !isFlagged;
    try {
      setSubmittingFlag(true);
      const res = await adminAssessmentsApi.flagAssessment(assessment.id, {
        flagged: nextFlagState,
        flagReason: nextFlagState ? flagReason || 'Flagged for clinical attention' : '',
      });
      if (res.success) {
        setIsFlagged(nextFlagState);
        if (onUpdated) onUpdated(nextFlagState ? 'Assessment flagged for triage' : 'Flag removed successfully');
      }
    } catch (err) {
      console.error('Failed to toggle flag:', err);
      alert(err.message || 'Failed to update flag state');
    } finally {
      setSubmittingFlag(false);
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
        <div className="flex items-center justify-between pb-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-heading font-black text-text tracking-tight">
                  Preliminary Assessment Review
                </h3>
                {assessment && (
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200">
                    {assessment.assessmentCode}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Review parent-submitted developmental questionnaire answers and clinical notes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {assessment && (
              <button
                type="button"
                onClick={handleToggleFlag}
                disabled={submittingFlag}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isFlagged
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
                }`}
              >
                {submittingFlag ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                {isFlagged ? 'Flagged' : 'Flag Case'}
              </button>
            )}

            <button 
              type="button" 
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1 custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
              <p className="text-sm font-bold">Loading assessment details...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-700 mb-1">Failed to Load Assessment</p>
              <p className="text-xs text-gray-500 mb-4">{error}</p>
              <button
                type="button"
                onClick={loadAssessment}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
              >
                Try Again
              </button>
            </div>
          ) : assessment ? (
            <>
              {/* Patient & Parent Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Child Card */}
                <div className="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black flex items-center justify-center text-base shrink-0">
                    <Baby className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                      Child Patient
                    </span>
                    <h4 className="font-bold text-text text-base leading-tight mt-0.5 truncate">
                      {assessment.child?.name || 'Unnamed Child'}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-500">
                      {assessment.child?.gender && (
                        <span className="px-1.5 py-0.5 bg-white rounded border border-gray-200 font-mono text-[10px] uppercase font-bold">
                          {assessment.child.gender}
                        </span>
                      )}
                      {assessment.child?.medicalConditions && (
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 text-[10px] font-bold">
                          {assessment.child.medicalConditions}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Parent Card */}
                <div className="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-base shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                      Parent / Guardian
                    </span>
                    <h4 className="font-bold text-text text-base leading-tight mt-0.5 truncate">
                      {assessment.parent?.name || 'Unassigned Parent'}
                    </h4>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {assessment.parent?.email || assessment.parent?.phone || 'No contact specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assessment Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 font-mono block">Submitted Date</span>
                    <span className="text-xs font-bold text-text font-mono">{assessment.formattedDate}</span>
                  </div>
                  <div className="h-6 w-px bg-gray-200"></div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 font-mono block">Completion</span>
                    <span className="text-xs font-bold text-emerald-600 font-mono">{assessment.completion}%</span>
                  </div>
                  <div className="h-6 w-px bg-gray-200"></div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 font-mono block">Current Status</span>
                    <span className="text-xs font-bold text-primary">{assessment.status}</span>
                  </div>
                </div>

                {assessment.reviewer && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 font-mono block">Reviewed By</span>
                    <span className="text-xs font-bold text-text">{assessment.reviewer.name}</span>
                  </div>
                )}
              </div>

              {/* Questionnaire Responses */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Developmental Screening Questionnaire ({assessment.questionnaire?.length || 0} Questions)
                </h4>

                <div className="space-y-3">
                  {(assessment.questionnaire || []).map((q, idx) => (
                    <div 
                      key={q.index ?? idx}
                      className="p-4 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-gray-400">
                            Q{idx + 1}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">
                            {q.category}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-text leading-snug">
                          {q.question}
                        </p>
                        {q.explanation && (
                          <p className="text-xs text-gray-500 font-medium">
                            {q.explanation}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0">
                        <span 
                          className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                            ANSWER_BADGES[q.answer?.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}
                        >
                          {q.answerLabel || q.answer}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review & Triage Section */}
              <div className="p-5 bg-blue-50/40 rounded-2xl border border-blue-100/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-text flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Reviewer Assessment & Triage Decision
                  </h4>
                  <span className="text-xs font-medium text-gray-500">
                    Authorized clinical action
                  </span>
                </div>

                {/* Status Selection */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('NEEDS_REVIEW')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedStatus === 'NEEDS_REVIEW'
                        ? 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-100 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Needs Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('REVIEWED')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedStatus === 'REVIEWED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-100 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Reviewed
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('IN_PROGRESS')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedStatus === 'IN_PROGRESS'
                        ? 'bg-gray-100 text-gray-700 border-gray-300 ring-2 ring-gray-100 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    In Progress
                  </button>
                </div>

                {/* Clinical Notes */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    Clinical Review Notes / Observations
                  </label>
                  <textarea
                    rows={3}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Enter clinical assessment notes, next steps, or consultation referrals..."
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 resize-none"
                  />
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-text hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSaveReview}
            disabled={submittingReview || loading || !assessment}
            className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submittingReview ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Assessment Review
          </button>
        </div>
      </div>
    </div>
  );
};
