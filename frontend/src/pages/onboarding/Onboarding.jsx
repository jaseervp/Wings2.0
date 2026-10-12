import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, ChevronRight, ChevronLeft, User, Baby, 
  HeartPulse, Activity, ClipboardCheck, AlertCircle, Edit3, Loader2 
} from 'lucide-react';
import PreliminaryAssessment, { QUESTIONS } from '../assessment/PreliminaryAssessment';
import { onboardingApi } from '../../features/onboarding/services/onboardingApi';

const STEPS = [
  'Welcome',
  'Parent Information',
  'Child Basic Information',
  'Birth & Medical Information',
  'Developmental Information',
  'Preliminary Assessment',
  'Review & Confirmation'
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();
  
  const [childId, setChildId] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // 'Saving...', 'Saved'

  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    childFirstName: '',
    childLastName: '',
    childPreferredName: '',
    childDob: '',
    childGender: '',
    childBloodGroup: '',
    birthType: '',
    pregnancyComplications: '',
    prematureBirth: '',
    birthWeight: '',
    nicuAdmission: '',
    medicalConditions: '',
    allergies: '',
    medications: '',
    motorSkillsDelays: '',
    speechLanguageDelays: '',
    socialInteractionConcerns: '',
    primaryConcerns: '',
    hasPriorAssessments: '',
    preliminaryAnswers: {},
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [stepErrorBanner, setStepErrorBanner] = useState('');

  // Fetch initial onboarding session and data from backend
  useEffect(() => {
    let isMounted = true;
    const fetchOnboardingState = async () => {
      try {
        const res = await onboardingApi.getStatus();
        if (!isMounted) return;

        if (res.success && res.data) {
          const { session, child, user, assessment } = res.data;

          // If already completed in DB, update local auth state and navigate to dashboard
          if (res.data.onboardingStatus === 'COMPLETED') {
            updateUser({ onboardingStatus: 'COMPLETED' });
            navigate('/dashboard', { replace: true });
            return;
          }

          setFormData(prev => ({
            ...prev,
            parentName: user?.fullName || currentUser?.fullName || '',
            parentEmail: user?.email || currentUser?.email || '',
            parentPhone: user?.phone || currentUser?.phone || '',
            childFirstName: child?.firstName || '',
            childLastName: child?.lastName || '',
            childPreferredName: child?.preferredName || '',
            childDob: child?.dateOfBirth ? new Date(child.dateOfBirth).toISOString().split('T')[0] : '',
            childGender: child?.gender || '',
            childBloodGroup: child?.bloodGroup || '',
            birthType: child?.birthType || '',
            pregnancyComplications: child?.pregnancyComplications || '',
            prematureBirth: child?.prematureBirth || '',
            birthWeight: child?.birthWeight !== undefined && child?.birthWeight !== null ? String(child.birthWeight) : '',
            nicuAdmission: child?.nicuAdmission || '',
            medicalConditions: child?.medicalConditions || '',
            allergies: child?.allergies || '',
            medications: child?.medications || '',
            motorSkillsDelays: child?.motorSkillsDelays || '',
            speechLanguageDelays: child?.speechLanguageDelays || '',
            socialInteractionConcerns: child?.socialInteractionConcerns || '',
            primaryConcerns: child?.primaryConcerns || '',
            hasPriorAssessments: child?.hasPriorAssessments || '',
            preliminaryAnswers: assessment?.responses || session?.assessmentResponses || {},
          }));

          if (child?._id) {
            setChildId(child._id);
          }

          // Resume step if previously in progress
          if (session?.stepIndex !== undefined && session.stepIndex > 0) {
            setCurrentStep(session.stepIndex);
          }
        }
      } catch (err) {
        console.error('Failed to load onboarding status:', err);
        // Fallback to currentUser from auth context
        if (currentUser) {
          setFormData(prev => ({
            ...prev,
            parentName: currentUser.fullName || '',
            parentEmail: currentUser.email || '',
            parentPhone: currentUser.phone || '',
          }));
        }
      } finally {
        if (isMounted) setLoadingInitial(false);
      }
    };

    fetchOnboardingState();
    return () => { isMounted = false; };
  }, [currentUser]);

  // Validation function for individual fields
  const validateField = (name, value) => {
    const valStr = value !== undefined && value !== null ? String(value) : '';
    const trimmed = valStr.trim();

    switch (name) {
      case 'parentName': {
        if (!trimmed) return 'Parent full name is required';
        if (/[^a-zA-Z\s]/.test(valStr)) return 'Name can only contain letters and spaces (no numbers or special characters)';
        if (trimmed.length < 2) return 'Name must be at least 2 characters';
        return '';
      }
      case 'parentEmail': {
        if (!trimmed) return 'Email address is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) return 'Please enter a valid email address';
        return '';
      }
      case 'parentPhone': {
        if (!trimmed) return 'Phone number is required';
        if (/[^0-9+\-\s]/.test(trimmed)) return 'Phone number can only contain digits';
        const digits = trimmed.replace(/\D/g, '');
        if (digits.length < 10) return 'Phone number must have at least 10 digits';
        if (digits.length > 15) return 'Phone number cannot exceed 15 digits';
        return '';
      }
      case 'childFirstName': {
        if (!trimmed) return 'Child first name is required';
        if (/[^a-zA-Z\s]/.test(valStr)) return 'Name can only contain letters and spaces (no numbers or special characters)';
        if (trimmed.length < 2) return 'First name must be at least 2 characters';
        return '';
      }
      case 'childLastName': {
        if (!trimmed) return 'Child last name is required';
        if (/[^a-zA-Z\s]/.test(valStr)) return 'Name can only contain letters and spaces (no numbers or special characters)';
        return '';
      }
      case 'childPreferredName': {
        if (!trimmed) return '';
        if (/[^a-zA-Z\s]/.test(valStr)) return 'Preferred name can only contain letters and spaces';
        return '';
      }
      case 'childDob': {
        if (!trimmed) return 'Date of birth is required';
        const selectedDate = new Date(trimmed);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (isNaN(selectedDate.getTime())) return 'Please enter a valid date';
        if (selectedDate > today) return 'Date of birth cannot be in the future';
        return '';
      }
      case 'childGender': {
        if (!trimmed) return 'Please select a gender';
        return '';
      }
      case 'birthWeight': {
        if (!trimmed) return '';
        const weight = parseFloat(trimmed);
        if (isNaN(weight) || weight <= 0 || weight > 20) {
          return 'Please enter a valid birth weight (0.5 to 20 kg)';
        }
        return '';
      }
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
    if (stepErrorBanner) setStepErrorBanner('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const validateStep = (step) => {
    const stepErrors = {};
    if (step === 1) {
      const eName = validateField('parentName', formData.parentName);
      const eEmail = validateField('parentEmail', formData.parentEmail);
      const ePhone = validateField('parentPhone', formData.parentPhone);
      if (eName) stepErrors.parentName = eName;
      if (eEmail) stepErrors.parentEmail = eEmail;
      if (ePhone) stepErrors.parentPhone = ePhone;
    } else if (step === 2) {
      const eFirst = validateField('childFirstName', formData.childFirstName);
      const eLast = validateField('childLastName', formData.childLastName);
      const ePref = validateField('childPreferredName', formData.childPreferredName);
      const eDob = validateField('childDob', formData.childDob);
      const eGender = validateField('childGender', formData.childGender);
      if (eFirst) stepErrors.childFirstName = eFirst;
      if (eLast) stepErrors.childLastName = eLast;
      if (ePref) stepErrors.childPreferredName = ePref;
      if (eDob) stepErrors.childDob = eDob;
      if (eGender) stepErrors.childGender = eGender;
    } else if (step === 3) {
      const eWeight = validateField('birthWeight', formData.birthWeight);
      if (eWeight) stepErrors.birthWeight = eWeight;
    }
    return stepErrors;
  };

  const getChildPayload = () => {
    return {
      firstName: formData.childFirstName,
      lastName: formData.childLastName,
      preferredName: formData.childPreferredName || undefined,
      dateOfBirth: formData.childDob,
      gender: formData.childGender,
      bloodGroup: formData.childBloodGroup || undefined,
      birthType: formData.birthType || undefined,
      prematureBirth: formData.prematureBirth || undefined,
      pregnancyComplications: formData.pregnancyComplications || undefined,
      nicuAdmission: formData.nicuAdmission || undefined,
      birthWeight: formData.birthWeight ? parseFloat(formData.birthWeight) : undefined,
      medicalConditions: formData.medicalConditions || undefined,
      allergies: formData.allergies || undefined,
      medications: formData.medications || undefined,
      motorSkillsDelays: formData.motorSkillsDelays || undefined,
      speechLanguageDelays: formData.speechLanguageDelays || undefined,
      socialInteractionConcerns: formData.socialInteractionConcerns || undefined,
      primaryConcerns: formData.primaryConcerns || undefined,
      hasPriorAssessments: formData.hasPriorAssessments || undefined,
    };
  };

  const persistStepProgress = async (nextStepIndex) => {
    try {
      setSaveStatus('Saving...');
      const childData = getChildPayload();
      const res = await onboardingApi.saveProgress({
        stepIndex: nextStepIndex,
        childId: childId || undefined,
        childData,
        assessmentResponses: formData.preliminaryAnswers,
      });
      if (res.success && res.data?.childId) {
        setChildId(res.data.childId);
      }
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(''), 2500);
    } catch (err) {
      console.error('Error saving progress:', err);
      setSaveStatus('');
    }
  };

  const handleNext = async () => {
    // Validate current step
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...stepErrors }));
      const newlyTouched = Object.keys(stepErrors).reduce((acc, k) => ({ ...acc, [k]: true }), {});
      setTouched(prev => ({ ...prev, ...newlyTouched }));
      setStepErrorBanner('Please fill all required fields correctly before proceeding.');
      return;
    }
    setStepErrorBanner('');

    if (currentStep === STEPS.length - 1) {
      // Final confirmation step: safety check on all previous required steps
      const parentErrors = validateStep(1);
      if (Object.keys(parentErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...parentErrors }));
        setCurrentStep(1);
        return;
      }
      const childErrors = validateStep(2);
      if (Object.keys(childErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...childErrors }));
        setCurrentStep(2);
        return;
      }

      // Complete onboarding through backend
      setIsSubmitting(true);
      try {
        const childData = getChildPayload();
        const res = await onboardingApi.complete({
          childId: childId || undefined,
          childData,
          assessmentResponses: formData.preliminaryAnswers,
        });

        if (res.success) {
          updateUser({ onboardingStatus: 'COMPLETED' });
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('Failed to complete onboarding:', err);
        setStepErrorBanner(err.message || 'Failed to complete onboarding. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (currentStep < STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Persist progress asynchronously
      persistStepProgress(nextStep);
    }
  };

  const handlePrev = () => {
    setStepErrorBanner('');
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1: // Parent Information
        return (
          <div className="space-y-6">
            <p className="text-gray-500 font-medium mb-6">
              Please confirm your details. We've pre-filled this from your signup.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="parentName" 
                  value={formData.parentName} 
                  onChange={handleChange} 
                  onBlur={handleBlur}
                  placeholder="e.g. John Doe"
                  className={`w-full px-4 py-3 rounded-xl outline-none transition-all font-medium text-gray-900 border ${
                    errors.parentName 
                      ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500' 
                      : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  }`} 
                />
                {errors.parentName && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.parentName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  name="parentEmail" 
                  value={formData.parentEmail} 
                  onChange={handleChange} 
                  onBlur={handleBlur}
                  placeholder="e.g. parent@example.com"
                  className={`w-full px-4 py-3 rounded-xl outline-none transition-all font-medium text-gray-900 border ${
                    errors.parentEmail 
                      ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500' 
                      : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  }`} 
                />
                {errors.parentEmail && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.parentEmail}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="parentPhone" 
                  value={formData.parentPhone} 
                  onChange={handleChange} 
                  onBlur={handleBlur}
                  placeholder="e.g. 9876543210"
                  className={`w-full px-4 py-3 rounded-xl outline-none transition-all font-medium text-gray-900 border ${
                    errors.parentPhone 
                      ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500' 
                      : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  }`} 
                />
                {errors.parentPhone && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.parentPhone}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 2: // Child Basic Information
        return (
          <div className="space-y-6">
            <p className="text-gray-500 font-medium mb-6">
              Tell us about your child so we can personalize their experience.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="childFirstName" 
                  value={formData.childFirstName} 
                  onChange={handleChange} 
                  onBlur={handleBlur}
                  placeholder="First name" 
                  className={`w-full px-4 py-3 rounded-xl outline-none transition-all font-medium text-gray-900 border ${
                    errors.childFirstName 
                      ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500' 
                      : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  }`} 
                />
                {errors.childFirstName && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.childFirstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="childLastName" 
                  value={formData.childLastName} 
                  onChange={handleChange} 
                  onBlur={handleBlur}
                  placeholder="Last name" 
                  className={`w-full px-4 py-3 rounded-xl outline-none transition-all font-medium text-gray-900 border ${
                    errors.childLastName 
                      ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500' 
                      : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  }`} 
                />
                {errors.childLastName && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.childLastName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Preferred Name / Nickname</label>
                <input 
                  type="text" 
                  name="childPreferredName" 
                  value={formData.childPreferredName} 
                  onChange={handleChange} 
                  onBlur={handleBlur}
                  placeholder="What should we call them?" 
                  className={`w-full px-4 py-3 rounded-xl outline-none transition-all font-medium text-gray-900 border ${
                    errors.childPreferredName 
                      ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500' 
                      : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  }`} 
                />
                {errors.childPreferredName && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.childPreferredName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  name="childDob" 
                  value={formData.childDob} 
                  onChange={handleChange} 
                  onBlur={handleBlur}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 rounded-xl outline-none transition-all font-medium text-gray-900 border ${
                    errors.childDob 
                      ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500' 
                      : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  }`} 
                />
                {errors.childDob && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.childDob}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select 
                  name="childGender" 
                  value={formData.childGender} 
                  onChange={handleChange} 
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl outline-none transition-all font-medium text-gray-900 border ${
                    errors.childGender 
                      ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500' 
                      : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.childGender && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.childGender}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Blood Group</label>
                <select name="childBloodGroup" value={formData.childBloodGroup} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900">
                  <option value="">Select Blood Group</option>
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
            </div>
          </div>
        );
      case 3: // Birth & Medical Information
        return (
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Birth Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Birth Type</label>
                  <select name="birthType" value={formData.birthType} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900">
                    <option value="">Select Birth Type</option>
                    <option value="VAGINAL">Vaginal</option>
                    <option value="C_SECTION">C-Section</option>
                    <option value="ASSISTED">Assisted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Birth Weight (kg)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="birthWeight" 
                    value={formData.birthWeight} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    placeholder="e.g. 3.2" 
                    className={`w-full px-4 py-3 rounded-xl outline-none transition-all font-medium text-gray-900 border ${
                      errors.birthWeight 
                        ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500' 
                        : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                    }`} 
                  />
                  {errors.birthWeight && (
                    <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-200">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.birthWeight}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Premature Birth?</label>
                  <select name="prematureBirth" value={formData.prematureBirth} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900">
                    <option value="">Select Option</option>
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">NICU Admission?</label>
                  <select name="nicuAdmission" value={formData.nicuAdmission} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900">
                    <option value="">Select Option</option>
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Pregnancy or Birth Complications</label>
                  <textarea name="pregnancyComplications" value={formData.pregnancyComplications} onChange={handleChange} rows="2" placeholder="Any complications during pregnancy or delivery?" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900"></textarea>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Medical Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Known Medical Conditions / Diagnosis</label>
                  <textarea name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} rows="2" placeholder="e.g. ASD Level 1, ADHD..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Allergies</label>
                  <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="e.g. Peanuts, Dust..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Current Medications</label>
                  <input type="text" name="medications" value={formData.medications} onChange={handleChange} placeholder="List any current medications" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900" />
                </div>
              </div>
            </div>
          </div>
        );
      case 4: // Developmental Information
        return (
          <div className="space-y-6">
            <p className="text-gray-500 font-medium mb-6">
              Please share any observations or concerns about your child's development.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Motor Skills Delays?</label>
                <select name="motorSkillsDelays" value={formData.motorSkillsDelays} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900">
                  <option value="">Select Option</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                  <option value="NOT_SURE">Not Sure</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Speech/Language Delays?</label>
                <select name="speechLanguageDelays" value={formData.speechLanguageDelays} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900">
                  <option value="">Select Option</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                  <option value="NOT_SURE">Not Sure</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Social Interaction Concerns?</label>
                <select name="socialInteractionConcerns" value={formData.socialInteractionConcerns} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900">
                  <option value="">Select Option</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                  <option value="NOT_SURE">Not Sure</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Prior Assessments?</label>
                <select name="hasPriorAssessments" value={formData.hasPriorAssessments} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900">
                  <option value="">Select Option</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Primary Concerns / Notes</label>
                <textarea name="primaryConcerns" value={formData.primaryConcerns} onChange={handleChange} rows="3" placeholder="Describe any specific concerns about behavior, learning, or development..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900"></textarea>
              </div>
            </div>
          </div>
        );
      case 6: // Review & Confirmation
        const ReviewItem = ({ label, value, className = '', wrap = false }) => (
          <div className={`flex flex-col min-w-0 ${className}`}>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">{label}</span>
            <span 
              title={typeof value === 'string' ? value : ''}
              className={`text-sm font-semibold text-gray-900 ${
                wrap 
                  ? 'break-words leading-relaxed' 
                  : 'whitespace-nowrap overflow-hidden text-ellipsis'
              }`}
            >
              {value || <span className="text-gray-300 italic font-normal">Not provided</span>}
            </span>
          </div>
        );

        return (
          <div className="space-y-8">
            <p className="text-gray-500 font-medium mb-2">
              Please review the information below before finalizing your account setup.
            </p>

            <div className="space-y-6">
              {/* Parent Info */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                      <User className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Parent Details</h4>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(1)} 
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.8fr_1.2fr] gap-6 items-start">
                  <ReviewItem label="Full Name" value={formData.parentName} />
                  <ReviewItem label="Email Address" value={formData.parentEmail} />
                  <ReviewItem label="Phone Number" value={formData.parentPhone} />
                </div>
              </div>

              {/* Child Basic Info */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                      <Baby className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Child Details</h4>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(2)} 
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                  <ReviewItem label="First Name" value={formData.childFirstName} />
                  <ReviewItem label="Last Name" value={formData.childLastName} />
                  <ReviewItem label="Preferred Name" value={formData.childPreferredName} />
                  <ReviewItem label="Date of Birth" value={formData.childDob} />
                  <ReviewItem label="Gender" value={formData.childGender} />
                  <ReviewItem label="Blood Group" value={formData.childBloodGroup} />
                </div>
              </div>

              {/* Birth & Medical */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Birth & Medical</h4>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(3)} 
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <ReviewItem label="Birth Type" value={formData.birthType} />
                    <ReviewItem label="Premature?" value={formData.prematureBirth} />
                    <ReviewItem label="NICU?" value={formData.nicuAdmission} />
                    <ReviewItem label="Birth Weight" value={formData.birthWeight ? `${formData.birthWeight} kg` : ''} />
                  </div>
                  <div className="space-y-4">
                    <ReviewItem label="Pregnancy Complications" value={formData.pregnancyComplications} wrap={true} />
                    <ReviewItem label="Medical Conditions" value={formData.medicalConditions} wrap={true} />
                    <ReviewItem label="Allergies" value={formData.allergies} wrap={true} />
                    <ReviewItem label="Medications" value={formData.medications} wrap={true} />
                  </div>
                </div>
              </div>

              {/* Developmental */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Developmental History</h4>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(4)} 
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <ReviewItem label="Motor Skills Delays" value={formData.motorSkillsDelays} />
                    <ReviewItem label="Speech/Language Delays" value={formData.speechLanguageDelays} />
                    <ReviewItem label="Social Interaction Concerns" value={formData.socialInteractionConcerns} />
                    <ReviewItem label="Prior Assessments" value={formData.hasPriorAssessments} />
                  </div>
                  <div>
                    <ReviewItem label="Primary Concerns" value={formData.primaryConcerns} wrap={true} />
                  </div>
                </div>
              </div>

              {/* Preliminary Assessment */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                      <ClipboardCheck className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Preliminary Assessment</h4>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(5)} 
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {QUESTIONS.map((q, idx) => {
                    const ans = formData.preliminaryAnswers[idx];
                    return (
                      <div key={idx} className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{q.text}</span>
                        <span className="text-sm font-semibold text-gray-900 capitalize">{ans || <span className="text-gray-300 italic text-sm normal-case">Not answered</span>}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-[#f3f6f9] flex flex-col items-center justify-center p-6 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-sm font-bold text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 0) {
    // Welcome Screen
    return (
      <div className="min-h-screen bg-[#f3f6f9] flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Welcome to WINGS!</h1>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Your account is active. Now let's complete your profile and set up your child's information for a personalized experience.
          </p>
          <button 
            onClick={handleNext}
            className="w-full py-4 px-6 bg-indigo-600 text-white rounded-2xl font-black text-base shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_25px_-8px_rgba(79,70,229,0.7)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Start Onboarding <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6f9] flex flex-col font-sans">
      {/* Top Header & Progress */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-gray-900">Account Setup</h2>
              {saveStatus && (
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all duration-200 ${
                  saveStatus === 'Saving...' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {saveStatus === 'Saving...' && <Loader2 className="w-3 h-3 animate-spin" />}
                  {saveStatus}
                </span>
              )}
            </div>
            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Step {currentStep} of {STEPS.length - 1}
            </span>
          </div>
          
          <div className="flex items-center justify-between w-full relative">
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full -z-10"></div>
             <div 
               className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full -z-10 transition-all duration-500"
               style={{ width: `${((currentStep - 1) / (STEPS.length - 2)) * 100}%` }}
             ></div>
             
             {STEPS.slice(1).map((step, idx) => {
               const stepNumber = idx + 1;
               const isActive = currentStep === stepNumber;
               const isCompleted = currentStep > stepNumber;
               
               return (
                 <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${
                     isActive ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' :
                     isCompleted ? 'border-indigo-600 bg-indigo-50 text-indigo-600' :
                     'border-gray-200 bg-white text-gray-400'
                   }`}>
                     {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNumber}
                   </div>
                   <span className={`text-[10px] font-bold uppercase tracking-wider hidden md:block ${isActive || isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                     {step.split(' ')[0]}
                   </span>
                 </div>
               );
             })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 w-full mx-auto p-6 my-8 ${currentStep === 5 ? 'max-w-6xl' : currentStep === 6 ? 'max-w-4xl' : 'max-w-3xl'}`}>
        {currentStep === 5 ? (
          <PreliminaryAssessment 
            isOnboarding={true} 
            onComplete={handleNext} 
            onBack={handlePrev} 
            initialAnswers={formData.preliminaryAnswers}
            onAnswersChange={(answers) => setFormData(prev => ({ ...prev, preliminaryAnswers: answers }))}
          />
        ) : (
          <>
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[400px]">
              <h3 className="text-2xl font-black text-gray-900 mb-6">{STEPS[currentStep]}</h3>
              
              {renderStepContent()}
            </div>

            {/* Error Banner if validation fails on continue */}
            {stepErrorBanner && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span>{stepErrorBanner}</span>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              <button 
                onClick={handlePrev}
                className="px-6 py-3 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              <button 
                onClick={handleNext}
                disabled={isSubmitting}
                className={`px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_25px_-8px_rgba(79,70,229,0.7)] hover:-translate-y-0.5 transition-all flex items-center gap-2 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Completing...</span>
                  </>
                ) : (
                  <>
                    {currentStep === STEPS.length - 1 ? 'Complete Setup' : 'Continue'} <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
