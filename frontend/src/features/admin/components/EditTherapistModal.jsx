import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle, Edit2, CheckCircle2 } from 'lucide-react';
import { adminTherapistsApi } from '../services/adminTherapistsApi';

export const EditTherapistModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  therapist, 
  specializations = [] 
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    availability: '',
    status: 'ACTIVE',
    activePatientCount: 0,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (therapist) {
      setFormData({
        fullName: therapist.fullName || '',
        email: therapist.email || '',
        phone: therapist.phone || '',
        specialization: therapist.specialization || specializations[0] || 'Speech Therapy',
        availability: therapist.availability || 'Mon - Fri',
        status: therapist.status || 'ACTIVE',
        activePatientCount: therapist.activePatientCount ?? 0,
      });
      setErrors({});
      setServerError(null);
    }
  }, [therapist, specializations]);

  if (!isOpen || !therapist) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setErrors({ fullName: 'Full name is required' });
      return;
    }

    try {
      setSubmitting(true);
      const therapistId = therapist._id || therapist.id;
      const res = await adminTherapistsApi.updateTherapist(therapistId, {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        specialization: formData.specialization.trim(),
        availability: formData.availability.trim(),
        status: formData.status,
        activePatientCount: Number(formData.activePatientCount) || 0,
      });

      if (res.success && res.data) {
        onSuccess(res.data);
        onClose();
      } else {
        throw new Error(res.message || 'Failed to update therapist');
      }
    } catch (err) {
      console.error('Error updating therapist:', err);
      setServerError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-heading font-black text-text tracking-tight flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-primary" />
              Edit Therapist Profile
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Update clinical information, scheduling availability, and account status.
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {serverError && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs font-semibold text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{serverError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-text block mb-1">Full Name *</label>
            <input 
              type="text" 
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              disabled={submitting}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.fullName && (
              <p className="text-[11px] font-semibold text-red-500 mt-1">{errors.fullName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text block mb-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text block mb-1">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text block mb-1">Specialization</label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text outline-none focus:border-primary cursor-pointer"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
                {!specializations.includes(formData.specialization) && (
                  <option value={formData.specialization}>{formData.specialization}</option>
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-text block mb-1">Availability</label>
              <input 
                type="text" 
                name="availability"
                placeholder="e.g. Mon - Fri"
                value={formData.availability}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text block mb-1">Account State</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text outline-none focus:border-primary cursor-pointer"
              >
                <option value="ACTIVE">Active</option>
                <option value="PENDING_VERIFICATION">Pending Verification</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-text block mb-1">Active Patients</label>
              <input 
                type="number" 
                name="activePatientCount"
                min="0"
                value={formData.activePatientCount}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
