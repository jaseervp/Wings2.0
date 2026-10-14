import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle, Baby, User, Calendar, Activity, Search } from 'lucide-react';
import { adminChildrenApi } from '../services/adminChildrenApi';

export const AddChildModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    parentId: '',
    firstName: '',
    lastName: '',
    preferredName: '',
    dateOfBirth: '',
    gender: 'MALE',
    bloodGroup: '',
    diagnosis: 'PENDING',
    medicalConditions: '',
  });

  const [parents, setParents] = useState([]);
  const [parentSearch, setParentSearch] = useState('');
  const [loadingParents, setLoadingParents] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Load parents on open
  useEffect(() => {
    if (isOpen) {
      setFormData({
        parentId: '',
        firstName: '',
        lastName: '',
        preferredName: '',
        dateOfBirth: '',
        gender: 'MALE',
        bloodGroup: '',
        diagnosis: 'PENDING',
        medicalConditions: '',
      });
      setErrors({});
      setTouched({});
      setServerError(null);
      fetchParents('');
    }
  }, [isOpen]);

  const fetchParents = async (searchStr) => {
    try {
      setLoadingParents(true);
      const res = await adminChildrenApi.getParents(searchStr);
      if (res.success && Array.isArray(res.data)) {
        setParents(res.data);
        if (res.data.length > 0 && !formData.parentId) {
          setFormData(prev => ({ ...prev, parentId: res.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load parents:', err);
    } finally {
      setLoadingParents(false);
    }
  };

  if (!isOpen) return null;

  const validateField = (name, value) => {
    let error = null;

    if (name === 'parentId') {
      if (!value) error = 'Please select a registered parent';
    }

    if (name === 'firstName') {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        error = 'First name is required';
      } else if (trimmed.length < 2) {
        error = 'First name must be at least 2 characters';
      } else if (/\d/.test(trimmed)) {
        error = 'First name must not contain numbers';
      }
    }

    if (name === 'lastName') {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        error = 'Last name is required';
      } else if (trimmed.length < 2) {
        error = 'Last name must be at least 2 characters';
      } else if (/\d/.test(trimmed)) {
        error = 'Last name must not contain numbers';
      }
    }

    if (name === 'dateOfBirth') {
      if (!value) {
        error = 'Date of birth is required';
      } else {
        const d = new Date(value);
        if (isNaN(d.getTime())) {
          error = 'Invalid date format';
        } else if (d > new Date()) {
          error = 'Date of birth cannot be in the future';
        }
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
    ['parentId', 'firstName', 'lastName', 'dateOfBirth'].forEach(field => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    setErrors(newErrors);
    setTouched({
      parentId: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const res = await adminChildrenApi.createChild({
        parentId: formData.parentId,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        preferredName: (formData.preferredName || '').trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup || undefined,
        diagnosis: formData.diagnosis || 'PENDING',
        medicalConditions: (formData.medicalConditions || '').trim() || undefined,
      });

      if (res.success && res.data) {
        onSuccess(res.data);
        onClose();
      } else {
        throw new Error(res.message || 'Failed to create child profile');
      }
    } catch (err) {
      console.error('Error creating child profile:', err);
      setServerError(err.message || 'Failed to create child profile. Please check your connection.');
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
              <Baby className="w-5 h-5 text-primary" />
              Add Child Profile
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Link a new child developmental record to an existing registered parent.
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
          
          {/* Parent Selection */}
          <div>
            <label className="text-xs font-bold text-text block mb-1">
              Select Parent / Guardian <span className="text-red-500">*</span>
            </label>
            {parents.length === 0 && !loadingParents ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
                No parent accounts found. Please register or invite a parent first in <strong>Parents & Users</strong>.
              </div>
            ) : (
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={submitting || loadingParents}
                className={`w-full px-3 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-text outline-none cursor-pointer ${
                  errors.parentId ? 'border-red-400 bg-red-50/20' : 'border-gray-200 focus:border-primary'
                }`}
              >
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.email})
                  </option>
                ))}
              </select>
            )}
            {errors.parentId && (
              <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.parentId}
              </p>
            )}
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text block mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="e.g. Aarav"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={submitting}
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium outline-none transition-all ${
                  errors.firstName 
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-500 bg-red-50/20' 
                    : 'border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'
                }`}
              />
              {errors.firstName && (
                <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-text block mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="e.g. Sharma"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={submitting}
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium outline-none transition-all ${
                  errors.lastName 
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-500 bg-red-50/20' 
                    : 'border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'
                }`}
              />
              {errors.lastName && (
                <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Preferred Name & Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text block mb-1">Preferred Name (Optional)</label>
              <input
                type="text"
                name="preferredName"
                placeholder="e.g. Aaru"
                value={formData.preferredName}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-text block mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                max={new Date().toISOString().split('T')[0]}
                disabled={submitting}
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium outline-none transition-all ${
                  errors.dateOfBirth 
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-500 bg-red-50/20' 
                    : 'border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.dateOfBirth}
                </p>
              )}
            </div>
          </div>

          {/* Gender, Blood Group & Diagnosis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-text block mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text outline-none focus:border-primary cursor-pointer"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-text block mb-1">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text outline-none focus:border-primary cursor-pointer"
              >
                <option value="">Unknown</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-text block mb-1">Diagnosis</label>
              <select
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text outline-none focus:border-primary cursor-pointer"
              >
                <option value="PENDING">Pending</option>
                <option value="MILD">Mild</option>
                <option value="MODERATE">Moderate</option>
                <option value="SEVERE">Severe</option>
                <option value="PROFOUND">Profound</option>
              </select>
            </div>
          </div>

          {/* Medical Conditions */}
          <div>
            <label className="text-xs font-bold text-text block mb-1">Medical Conditions / Primary Concerns</label>
            <input
              type="text"
              name="medicalConditions"
              placeholder="e.g. Speech delay, ASD Level 1, Sensory sensitivity"
              value={formData.medicalConditions}
              onChange={handleChange}
              disabled={submitting}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
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
              disabled={submitting || parents.length === 0}
              className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Child...</span>
                </>
              ) : (
                <span>Create Child Profile</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
