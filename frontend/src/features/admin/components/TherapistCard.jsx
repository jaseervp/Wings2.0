import React from 'react';
import { Star, Calendar, Users, Edit2, Video, UserCheck } from 'lucide-react';

const AVATAR_BG_COLORS = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-cyan-600',
  'bg-rose-500',
  'bg-amber-600',
];

const getAvatarBg = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_BG_COLORS.length;
  return AVATAR_BG_COLORS[index];
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'T';
  if (parts[0].toLowerCase().startsWith('dr.') && parts.length > 1) {
    return parts[1].charAt(0).toUpperCase();
  }
  return parts[0].charAt(0).toUpperCase();
};

const STATUS_MAP = {
  ACTIVE: { label: 'Active', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  PENDING_VERIFICATION: { label: 'Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  INACTIVE: { label: 'Inactive', bg: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
  SUSPENDED: { label: 'Suspended', bg: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  BANNED: { label: 'Banned', bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
};

export const TherapistCard = ({ therapist, onEdit, onSchedule }) => {
  const name = therapist.fullName || 'Therapist';
  const initial = getInitials(name);
  const avatarBg = getAvatarBg(name);
  const statusConfig = STATUS_MAP[therapist.status] || STATUS_MAP.ACTIVE;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all flex flex-col group relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-gray-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>

      {/* Header */}
      <div className="p-6 flex gap-5 border-b border-gray-100 items-center">
        <div
          className={`w-16 h-16 rounded-full ${avatarBg} text-white font-black flex items-center justify-center text-2xl shrink-0 shadow-inner border-4 border-white ring-2 ring-gray-50 group-hover:scale-105 transition-transform`}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-admin-heading font-black text-text truncate group-hover:text-primary transition-colors text-lg leading-tight">
              {name}
            </h3>
            {therapist.rating ? (
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100 shrink-0">
                <Star className="w-3 h-3 fill-amber-600 text-amber-600" /> {therapist.rating.toFixed(1)}
              </div>
            ) : (
              <div className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-100 shrink-0">
                New
              </div>
            )}
          </div>
          <p className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md inline-block mt-1.5 mb-1">
            {therapist.specialization || 'General Specialist'}
          </p>
          <p className="text-[11px] font-bold text-gray-500 font-mono">
            {therapist.reviewCount ? `Based on ${therapist.reviewCount} reviews` : 'No reviews yet'}
          </p>
        </div>
      </div>

      {/* Information Section */}
      <div className="p-6 flex-1 space-y-4 bg-gray-50/30">
        <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
          <span className="flex items-center gap-2.5 text-gray-500">
            <Calendar className="w-4 h-4 text-gray-400" /> Availability
          </span>
          <span className="font-bold text-text">
            {therapist.availability || 'Mon - Fri'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
          <span className="flex items-center gap-2.5 text-gray-500">
            <Users className="w-4 h-4 text-gray-400" /> Patients
          </span>
          <span className="font-bold font-mono text-text bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
            {therapist.activePatientCount ?? 0} Active
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
          <span className="flex items-center gap-2.5 text-gray-500">
            <UserCheck className="w-4 h-4 text-gray-400" /> Status
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusConfig.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-5 bg-white border-t border-gray-100 flex gap-3">
        <button
          onClick={() => onEdit(therapist)}
          className="flex-1 py-2.5 text-sm font-bold text-gray-600 hover:text-primary hover:bg-blue-50 border border-gray-200 hover:border-blue-100 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Edit2 className="w-4 h-4" /> Edit Profile
        </button>
        <button
          onClick={() => onSchedule(therapist)}
          className="flex-1 py-2.5 text-sm font-bold bg-primary text-white border border-primary hover:bg-primary/90 hover:border-primary/90 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
        >
          <Video className="w-4 h-4" /> Schedule
        </button>
      </div>
    </div>
  );
};
