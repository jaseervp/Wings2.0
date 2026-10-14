import React, { useState, useEffect } from 'react';
import { 
  X, Baby, User, Calendar, Activity, Heart, Shield, FileText, 
  Clock, CheckCircle2, AlertCircle, Loader2 
} from 'lucide-react';
import { adminChildrenApi } from '../services/adminChildrenApi';

export const ChildDetailsModal = ({ isOpen, onClose, childId }) => {
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && childId) {
      const loadChild = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await adminChildrenApi.getChild(childId);
          if (res.success && res.data) {
            setChild(res.data);
          } else {
            throw new Error(res.message || 'Failed to load child profile');
          }
        } catch (err) {
          console.error('Failed to load child:', err);
          setError(err.message || 'Unable to load profile data');
        } finally {
          setLoading(false);
        }
      };
      loadChild();
    }
  }, [isOpen, childId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-xl font-heading font-black text-text tracking-tight flex items-center gap-2">
              <Baby className="w-5 h-5 text-primary" />
              Complete Child Profile
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Comprehensive developmental history, clinical examinations, and parent records.
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-bold text-gray-500">Loading developmental records...</p>
            </div>
          ) : error || !child ? (
            <div className="p-10 text-center space-y-2">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
              <p className="text-sm font-bold text-text">{error || 'Child profile not found'}</p>
            </div>
          ) : (
            <>
              {/* Profile Overview Card */}
              <div className="p-5 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary text-white font-black flex items-center justify-center text-2xl shrink-0 shadow-md">
                    {child.fullName ? child.fullName.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h4 className="text-lg font-admin-heading font-black text-text">{child.fullName}</h4>
                    {child.preferredName && (
                      <p className="text-xs font-bold text-primary">Known as: &ldquo;{child.preferredName}&rdquo;</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-600 font-medium">
                      <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
                        {child.age}
                      </span>
                      <span>•</span>
                      <span>{child.gender}</span>
                      {child.bloodGroup && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-red-600">Blood: {child.bloodGroup}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Clinical Diagnosis</span>
                  <span className="inline-block mt-1 px-3 py-1 bg-white text-primary border border-blue-200 rounded-lg text-xs font-black shadow-sm uppercase tracking-wide">
                    {child.diagnosis || 'PENDING'}
                  </span>
                </div>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex items-center gap-1 border-b border-gray-100 pb-2">
                {[
                  { id: 'overview', label: 'Overview & Parent' },
                  { id: 'medical', label: 'Birth & Medical' },
                  { id: 'developmental', label: 'Developmental History' },
                  { id: 'assessments', label: 'Exams & Assessments' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-500 hover:text-text hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Overview & Parent */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-2xl space-y-3">
                    <h5 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Associated Parent / Guardian
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
                      <div>
                        <span className="text-gray-400 block">Full Name</span>
                        <span className="text-text font-bold text-sm">{child.parentName || 'Unassigned'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Email Address</span>
                        <span className="text-text font-semibold">{child.parent?.email || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Contact Phone</span>
                        <span className="text-text font-semibold">{child.parent?.phone || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Account Role</span>
                        <span className="text-emerald-700 font-bold uppercase">{child.parent?.role || 'PARENT'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-2xl space-y-3">
                    <h5 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" /> Registration & Birth Details
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
                      <div>
                        <span className="text-gray-400 block">Date of Birth</span>
                        <span className="text-text font-bold font-mono">
                          {child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Profile Created</span>
                        <span className="text-text font-semibold font-mono">
                          {child.createdAt ? new Date(child.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Last Exam Status</span>
                        <span className="text-text font-semibold">{child.lastExam || 'Never'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Account Status</span>
                        <span className="text-emerald-700 font-bold uppercase">{child.status || 'ACTIVE'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Birth & Medical */}
              {activeTab === 'medical' && (
                <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-2xl space-y-4">
                  <h5 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" /> Birth & Clinical History
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-medium">
                    <div>
                      <span className="text-gray-400 block">Birth Delivery Type</span>
                      <span className="text-text font-bold">{child.birthType || 'Standard'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Birth Weight (kg)</span>
                      <span className="text-text font-bold font-mono">{child.birthWeight ? `${child.birthWeight} kg` : 'Not recorded'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Premature Birth</span>
                      <span className="text-text font-semibold">{child.prematureBirth || 'No'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">NICU Admission</span>
                      <span className="text-text font-semibold">{child.nicuAdmission || 'No'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Known Medical Conditions</span>
                      <span className="text-text font-semibold">{child.medicalConditions || 'None reported'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Allergies</span>
                      <span className="text-text font-semibold">{child.allergies || 'None reported'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-400 block">Current Medications</span>
                      <span className="text-text font-semibold">{child.medications || 'None'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Developmental History */}
              {activeTab === 'developmental' && (
                <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-2xl space-y-4">
                  <h5 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-500" /> Developmental Milestones & Concerns
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-medium">
                    <div>
                      <span className="text-gray-400 block">Motor Skills Delays</span>
                      <span className="text-text font-semibold">{child.motorSkillsDelays || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Speech / Language Delays</span>
                      <span className="text-text font-semibold">{child.speechLanguageDelays || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Social Interaction Concerns</span>
                      <span className="text-text font-semibold">{child.socialInteractionConcerns || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Prior Clinical Assessments</span>
                      <span className="text-text font-semibold">{child.hasPriorAssessments || 'None'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-400 block">Primary Parental Concerns</span>
                      <span className="text-text font-bold bg-white p-2.5 rounded-xl border border-gray-200 block">
                        {child.primaryConcerns || 'No primary concerns noted'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Exams & Assessments */}
              {activeTab === 'assessments' && (
                <div className="space-y-3">
                  {(!child.assessments || child.assessments.length === 0) ? (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-gray-600">No formalized assessments recorded yet.</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Assessments taken by parents will appear here automatically.</p>
                    </div>
                  ) : (
                    child.assessments.map((a, idx) => (
                      <div key={idx} className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-text uppercase flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            {a.type || 'Preliminary Assessment'}
                          </span>
                          <span className="text-[11px] font-mono text-gray-500">
                            {a.completedAt ? new Date(a.completedAt).toLocaleString() : 'Recent'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Status: <strong className="text-emerald-700">{a.status}</strong> • Version: {a.version}
                        </p>
                        {a.responses && (
                          <div className="text-[11px] bg-gray-50 p-2.5 rounded-xl border border-gray-100 space-y-1">
                            <span className="font-bold text-gray-500 uppercase tracking-wider block">Questionnaire Responses:</span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {Object.entries(a.responses).map(([k, v]) => (
                                <div key={k} className="truncate">
                                  <span className="text-gray-400 font-mono">Q{Number(k)+1}: </span>
                                  <strong className="text-text capitalize">{String(v)}</strong>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary/90 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
