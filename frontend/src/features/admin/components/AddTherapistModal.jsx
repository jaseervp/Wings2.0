import React, { useState, useEffect } from 'react';
import { X, Loader2, Eye, EyeOff, AlertCircle, Stethoscope, Mail, Phone, Lock, Calendar } from 'lucide-react';
import { adminTherapistsApi } from '../services/adminTherapistsApi';

export const AddTherapistModal = ({ isOpen, onClose, onSuccess, specializations = [] }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    temporaryPassword: '',
    specialization: specializations[0] || 'Speech Therapy',
    availability: 'Mon - Fri',
    status: 'ACTIVE',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        temporaryPassword: '',
        specialization: specializations[0] || 'Speech Therapy',
        availability: 'Mon - Fri',
        status: 'ACTIVE',
      });
      setErrors({});
      setTouched({});
      setShowPassword(false);
      setServerError(null);
    }
  }, [isOpen, specializations]);

  if (!isOpen) return null;

  const validateField = (name, value) => {
    let error = null;

    if (name === 'fullName') {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        error = 'Full name is required';
      } else if (trimmed.length < 2) {
        error = 'Name must be at least 2 characters';
      } else if (/\d/.test(trimmed)) {
        error = 'Name must not contain numbers';
      }
    }

    if (name === 'email') {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        error = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        error = 'Please enter a valid email address';
      }
    }

    if (name === 'phone') {
      const trimmed = (value || '').trim();
      const digitCount = (trimmed.match(/\d/g) || []).length;
      if (!trimmed) {
        error = 'Phone number is required';
      } else if (!/^[+]?[\d\s-]{7,20}$/.test(trimmed) || digitCount < 7) {
        error = 'Enter a valid phone number (minimum 7 digits)';
      }
    }

    if (name === 'temporaryPassword') {
      if (!value) {
        error = 'Temporary password is required';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters';
      }
    }

    if (name === 'specialization') {
      if (!value || !value.trim()) {
        error = 'Specialization is required';
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setServerError(null);

    if (touched[name]) {
      const err = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const validateForm = () => {
    const newErrors = {};
    ['fullName', 'email', 'phone', 'temporaryPassword', 'specialization'].forEach(field => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      temporaryPassword: true,
      specialization: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const res = await adminTherapistsApi.createTherapist({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        temporaryPassword: formData.temporaryPassword,
        specialization: formData.specialization.trim(),
        availability: formData.availability.trim(),
        status: formData.status,
      });

      if (res.success && res.data) {
        onSuccess(res.data);
        onClose();
      } else {
        throw new Error(res.message || 'Failed to create therapist');
      }
    } catch (err) {
      console.error('Error creating therapist:', err);
      setServerError(err.message || 'Failed to create therapist. Please check your connection.');
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
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-heading font-black text-text tracking-tight flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" />
              Add Therapist
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Provision a new clinical staff account with specialization and availability.
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

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs font-semibold text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{serverError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-text block mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="fullName"
              placeholder="e.g. Dr. Meera Nair"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitting}
              className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium outline-none transition-all ${
                errors.fullName 
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-500 bg-red-50/20' 
                  : 'border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'
              }`}
            />
            {errors.fullName && (
              <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.fullName}
              </p>
            )}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text block mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                name="email"
                placeholder="doctor@wings.health"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={submitting}
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium outline-none transition-all ${
                  errors.email 
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-500 bg-red-50/20' 
                    : 'border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-text block mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input 
                type="tel" 
                name="phone"
                placeholder="e.g. +91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={submitting}
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium outline-none transition-all ${
                  errors.phone 
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-500 bg-red-50/20' 
                    : 'border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'
                }`}
              />
              {errors.phone && (
                <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Temporary Password */}
          <div>
            <label className="text-xs font-bold text-text block mb-1">
              Temporary Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="temporaryPassword"
                placeholder="Minimum 6 characters"
                value={formData.temporaryPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={submitting}
                className={`w-full pl-4 pr-11 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium outline-none transition-all ${
                  errors.temporaryPassword 
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-500 bg-red-50/20' 
                    : 'border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'
                }`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.temporaryPassword && (
              <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.temporaryPassword}
              </p>
            )}
          </div>

          {/* Specialization & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text block mb-1">
                Specialization <span className="text-red-500">*</span>
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
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

          {/* Account State */}
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

          {/* Action Buttons */}
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
                  <span>Creating Therapist...</span>
                </>
              ) : (
                <span>Add Therapist</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
