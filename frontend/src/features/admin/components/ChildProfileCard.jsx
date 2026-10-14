import React from 'react';
import { User, Activity, Calendar, ChevronRight } from 'lucide-react';

const AVATAR_BG_COLORS = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-teal-500',
  'bg-indigo-500',
];

const getAvatarBg = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_BG_COLORS.length;
  return AVATAR_BG_COLORS[index];
};

const getDiagnosisBadge = (diag = '') => {
  const upper = (diag || '').toUpperCase();
  if (upper.includes('MODERATE')) {
    return { label: diag, style: 'bg-emerald-50 text-emerald-600 border border-emerald-100' };
  }
  if (upper.includes('MILD')) {
    return { label: diag, style: 'bg-blue-50 text-blue-600 border border-blue-100' };
  }
  if (upper.includes('SEVERE')) {
    return { label: diag, style: 'bg-amber-50 text-amber-600 border border-amber-100' };
  }
  if (upper.includes('PROFOUND')) {
    return { label: diag, style: 'bg-red-50 text-red-600 border border-red-100' };
  }
  return { label: diag || 'PENDING', style: 'bg-gray-100 text-gray-600 border border-gray-200' };
};

export const ChildProfileCard = ({ child, onViewDetails }) => {
  const displayName = child.fullName || `${child.firstName || ''} ${child.lastName || ''}`.trim() || 'Child Profile';
  const initial = displayName.charAt(0).toUpperCase() || 'C';
  const avatarBg = getAvatarBg(displayName);
  const diagBadge = getDiagnosisBadge(child.diagnosis);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:border-gray-300 hover:shadow-md transition-all group flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-gray-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>

      {/* Header */}
      <div className="flex gap-4 items-center mb-6">
        <div
          className={`w-14 h-14 rounded-full ${avatarBg} text-white font-black flex items-center justify-center text-xl shrink-0 shadow-inner border-2 border-white ring-2 ring-gray-50 group-hover:scale-105 transition-transform`}
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-admin-heading font-bold text-text group-hover:text-primary transition-colors leading-tight truncate text-base">
            {displayName}
          </h3>
          <p className="text-xs text-gray-500 font-mono mt-1 font-bold">
            {child.age || '—'}
          </p>
        </div>
      </div>

      {/* Info Rows */}
      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gray-400" /> Parent
          </span>
          <span className="font-bold text-text truncate max-w-[130px]" title={child.parent}>
            {child.parent || 'Unassigned'}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-gray-400" /> Diagnosis
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${diagBadge.style}`}
          >
            {diagBadge.label}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" /> Last Exam
          </span>
          <span className="font-mono text-gray-600 font-bold text-xs">
            {child.lastExam || 'Never'}
          </span>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={() => onViewDetails(child)}
        className="w-full mt-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
      >
        <span>View Full Profile</span>
        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
