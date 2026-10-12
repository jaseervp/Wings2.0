import React from 'react';
import { X, Calendar, Video, Clock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ScheduleModal = ({ isOpen, onClose, therapist }) => {
  const navigate = useNavigate();

  if (!isOpen || !therapist) return null;

  const handleGoToConsultations = () => {
    onClose();
    navigate(`/admin/consultations?therapistId=${therapist._id || therapist.id}&name=${encodeURIComponent(therapist.fullName)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-heading font-black text-text tracking-tight flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Schedule Session
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Book or review clinical sessions for this therapist.
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

        <div className="space-y-4">
          {/* Therapist Info Badge */}
          <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-primary text-white font-black flex items-center justify-center text-lg shrink-0 shadow-inner">
              {therapist.fullName ? therapist.fullName.replace(/^dr\.\s+/i, '').charAt(0).toUpperCase() : 'T'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-admin-heading font-black text-text text-sm truncate">{therapist.fullName}</h4>
              <p className="text-xs font-bold text-blue-700">{therapist.specialization || 'Clinical Specialist'}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Availability: <strong className="text-text">{therapist.availability || 'Mon - Fri'}</strong></span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2 text-xs text-gray-600 font-medium leading-relaxed">
            <div className="flex items-center gap-2 text-gray-700 font-bold">
              <Clock className="w-4 h-4 text-primary" />
              <span>Session Booking Integration</span>
            </div>
            <p>
              This therapist is active in the clinical directory with <strong>{therapist.activePatientCount ?? 0} active patients</strong>. You can schedule new parent-therapist video consultations or in-person sessions directly through the Consultations management calendar.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={handleGoToConsultations}
              className="w-full py-3 bg-primary text-white font-bold text-xs rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 transition-all"
            >
              <span>Manage in Consultations Calendar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
