import React, { useState, useEffect } from 'react';
import { X, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2, Shield, User, Mail, Phone, Lock } from 'lucide-react';
import { adminUsersApi } from '../services/adminUsersApi';

export const AddUserModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  currentTab = 'All Users',
  onSwitchTab 
}) => {
  // Determine initial role based on current active tab
  const getInitialRole = () => {
    if (currentTab === 'Parents') return 'PARENT';
    if (currentTab === 'Therapists') return 'THERAPIST';
    if (currentTab === 'Admins') return 'ADMIN';
    return 'PARENT';
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    temporaryPassword: '',
    role: getInitialRole(),
    status: 'ACTIVE',
    plan: 'FREE',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Reset form when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        temporaryPassword: '',
        role: getInitialRole(),
        status: 'ACTIVE',
        plan: 'FREE',
      });
      setErrors({});
      setTouched({});
      setShowPassword(false);
      setServerError(null);
    }
  }, [isOpen, currentTab]);

  if (!isOpen) return null;

  // Real-time Field Validator
  const validateField = (name, value) => {
    let error = null;

    if (name === 'fullName') {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        error = 'Full name is required';
      } else if (trimmed.length < 2) {
        error = 'Name must be at least 2 characters';
      } else if (/\d/.test(trimmed)) {
        error = 'Name must not contain numeric digits';
      } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
        error = 'Name contains invalid characters';
      }
    }

    if (name === 'email') {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        error = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        error = 'Enter a valid email address (e.g. name@domain.com)';
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

    if (name === 'role') {
      if (!value) {
        error = 'Please select a user role';
      }
    }

    return error;
  };

  // Handle Input Changes with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setServerError(null);

    // Validate on change if field has already been touched
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: err }));
    }
  };

  // Handle Input Blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  // Validate entire form before submission
  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ['fullName', 'email', 'phone', 'temporaryPassword', 'role'];

    fieldsToValidate.forEach(field => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      temporaryPassword: true,
      role: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        temporaryPassword: formData.temporaryPassword,
        role: formData.role,
        status: formData.status,
        plan: formData.plan,
      };

      const res = await adminUsersApi.createUser(payload);

      if (res.success && res.data) {
        onSuccess(res.data);
        onClose();
      } else {
        throw new Error(res.message || 'Failed to create user');
      }
    } catch (err) {
      console.error('Failed to create user:', err);
      setServerError(err.message || 'Failed to create user. Please check your connection and try again.');
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
            <h3 className="text-xl font-heading font-black text-text tracking-tight">Add New User</h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Provision an account with real database access and permissions.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs font-semibold text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              {serverError}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-text block mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                name="fullName"
                placeholder="e.g. Dr. Priya Sharma"
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
            </div>
            {errors.fullName && (
              <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Address & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Address */}
            <div>
              <label className="text-xs font-bold text-text block mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                name="email"
                placeholder="name@email.com"
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

            {/* Phone Number */}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.temporaryPassword ? (
              <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.temporaryPassword}
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1">
                Hashed securely before storage. Account holder will be prompted to change upon first login.
              </p>
            )}
          </div>

          {/* Role, Account State & Plan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Role */}
            <div>
              <label className="text-xs font-bold text-text block mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="PARENT">Parent</option>
                <option value="THERAPIST">Therapist</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Account State */}
            <div>
              <label className="text-xs font-bold text-text block mb-1">Account State</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="ACTIVE">Active</option>
                <option value="PENDING_VERIFICATION">Pending Verification</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            {/* Plan */}
            <div>
              <label className="text-xs font-bold text-text block mb-1">Plan</label>
              <select 
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="FREE">Free</option>
                <option value="PRO">Pro</option>
                <option value="PREMIUM">Premium</option>
              </select>
            </div>
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
              className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating User...</span>
                </>
              ) : (
                <span>Create User</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
