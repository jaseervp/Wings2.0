import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Heart, User, Phone, ChevronRight, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // Floating label states
  const [focusStates, setFocusStates] = useState({ name: false, email: false, phone: false, pass: false, confirmPass: false });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', pass: '', confirmPass: '', terms: false, marketing: false });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Simple floating animation logic for the artwork side
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleFocus = (field) => setFocusStates(prev => ({ ...prev, [field]: true }));
  
  const validateField = (field, val, allData = formData) => {
    const valStr = val !== undefined && val !== null ? String(val) : '';
    const trimmed = valStr.trim();
    switch (field) {
      case 'name':
        if (!trimmed) return 'Full name is required';
        if (/[^a-zA-Z\s]/.test(valStr)) return 'Name can only contain letters and spaces (no numbers or special characters)';
        if (trimmed.length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!trimmed) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (!trimmed) return 'Phone number is required';
        if (/[^0-9+\-\s]/.test(trimmed)) return 'Phone number can only contain digits';
        if (trimmed.replace(/\D/g, '').length < 10) return 'Phone number must have at least 10 digits';
        return '';
      case 'pass':
        if (!valStr) return 'Password is required';
        if (valStr.length < 8) return 'Password must be at least 8 characters';
        return '';
      case 'confirmPass':
        if (!valStr) return 'Please confirm your password';
        if (valStr !== allData.pass) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field) => {
    setFocusStates(prev => ({ ...prev, [field]: false }));
    setTouched(prev => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setFieldErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleChange = (field, val) => {
    const nextData = { ...formData, [field]: val };
    setFormData(nextData);
    const err = validateField(field, val, nextData);
    setFieldErrors(prev => ({ ...prev, [field]: err }));
    if (field === 'pass' && nextData.confirmPass) {
      const confirmErr = validateField('confirmPass', nextData.confirmPass, nextData);
      setFieldErrors(prev => ({ ...prev, confirmPass: confirmErr }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      pass: validateField('pass', formData.pass),
      confirmPass: validateField('confirmPass', formData.confirmPass),
    };
    const hasError = Object.values(errs).some(Boolean);
    if (hasError) {
      setFieldErrors(errs);
      setTouched({ name: true, email: true, phone: true, pass: true, confirmPass: true });
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.pass,
        confirmPassword: formData.confirmPass,
        termsAccepted: formData.terms,
        marketingConsent: formData.marketing,
      };
      const res = await register(payload);
      setSuccessMsg(res.message || 'Account created successfully.');
      setTimeout(() => {
        if (res.data?.verificationId) {
          navigate('/verify-otp', { 
            state: { 
              verificationId: res.data.verificationId,
              maskedDestination: res.data.maskedDestination,
              expiresIn: res.data.expiresIn
            }
          });
        } else {
          navigate('/login');
        }
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f9] flex font-sans selection:bg-teal-500/30 selection:text-teal-900 overflow-hidden relative">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-teal-200/50 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: '9s' }}></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[35vw] h-[35vw] bg-indigo-200/50 rounded-full blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDuration: '11s', animationDelay: '2s' }}></div>
      
      {/* ================================================== */}
      {/* LEFT SIDE: PREMIUM BRANDING & ARTWORK              */}
      {/* ================================================== */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-teal-500 via-indigo-500 to-indigo-700 rounded-r-[60px] shadow-[20px_0_60px_-15px_rgba(0,0,0,0.1)]">
        
        {/* Animated Inner Elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2)_0%,transparent_60%)] pointer-events-none"></div>
        
        {/* Top: Navbar Area */}
        <div className="relative z-20 flex justify-between items-center w-full">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl group-hover:bg-white/25 transition-all duration-300 border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-105 group-hover:-rotate-3">
              <Heart className="w-7 h-7 text-white fill-white/40 group-hover:fill-white/60 transition-colors" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight drop-shadow-sm font-admin-heading">Wings</span>
          </Link>
        </div>

        {/* Middle: Content */}
        <div 
          className="relative z-20 w-full max-w-lg mt-12 transition-transform duration-700 ease-out mr-auto ml-0"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-bold tracking-wide mb-6 border border-white/30 backdrop-blur-md">
              Start Your Journey
            </span>
            <h1 className="text-5xl font-black text-white leading-[1.1] mb-6 drop-shadow-md">
              A Better Future <br/> For Your Child
            </h1>
            <p className="text-teal-50 text-lg leading-relaxed font-medium max-w-md">
              By creating an account, you unlock access to professional early-detection tools, tailored therapies, and an entire community ready to support you.
            </p>
          </div>
        </div>

        {/* Bottom: Footer Info */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between text-white/80 text-sm font-medium w-full border-t border-white/20 pt-6">
          <p className="mb-4 sm:mb-0">© 2026 Wings Healthcare.</p>
          <div className="flex gap-6 items-center">
            <a href="#" className="hover:text-white hover:underline transition-all decoration-white/50 underline-offset-4">Privacy Policy</a>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <a href="#" className="hover:text-white hover:underline transition-all decoration-white/50 underline-offset-4">Terms</a>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* RIGHT SIDE: PREMIUM INTERACTIVE FORM               */}
      {/* ================================================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-20">
        
        {/* Mobile Header */}
        <div className="absolute top-6 left-6 lg:hidden z-30">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-teal-600/10 rounded-xl group-hover:bg-teal-600/20 transition-all">
              <Heart className="w-6 h-6 text-teal-600 fill-teal-600/20" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">Wings</span>
          </Link>
        </div>

        <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
          
          <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white p-8 sm:p-10 lg:p-12 relative">
            
            <div className="text-center mb-10">
              <div className="mx-auto w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-teal-100">
                <Heart className="w-8 h-8 text-teal-600 fill-teal-600/20" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">Join Wings ✨</h2>
              <p className="text-gray-500 font-medium text-sm">
                Start your child's supported journey today
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm font-semibold">
                {successMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Floating Label Input: Full Name */}
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300 ${fieldErrors.name ? 'text-red-500' : focusStates.name || formData.name ? 'text-teal-500' : 'text-gray-400'}`}>
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onFocus={() => handleFocus('name')}
                  onBlur={() => handleBlur('name')}
                  className={`w-full pl-14 pr-4 pt-6 pb-2 rounded-2xl text-base font-semibold text-gray-800 focus:outline-none transition-all shadow-sm peer ${
                    fieldErrors.name
                      ? 'border-2 border-red-400 bg-red-50/20 focus:border-red-500'
                      : 'bg-gray-50/50 border-2 border-gray-100 focus:border-teal-500 focus:bg-white hover:border-gray-200'
                  }`}
                  placeholder=" "
                />
                <label 
                  htmlFor="name" 
                  className={`absolute left-14 transition-all duration-300 pointer-events-none font-bold
                    ${focusStates.name || formData.name ? `top-2 text-xs ${fieldErrors.name ? 'text-red-500' : 'text-teal-500'}` : 'top-4 text-sm text-gray-400'}`}
                >
                  Full Name
                </label>
                {fieldErrors.name && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 ml-2 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Floating Label Input: Email */}
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300 ${fieldErrors.email ? 'text-red-500' : focusStates.email || formData.email ? 'text-teal-500' : 'text-gray-400'}`}>
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  className={`w-full pl-14 pr-4 pt-6 pb-2 rounded-2xl text-base font-semibold text-gray-800 focus:outline-none transition-all shadow-sm peer ${
                    fieldErrors.email
                      ? 'border-2 border-red-400 bg-red-50/20 focus:border-red-500'
                      : 'bg-gray-50/50 border-2 border-gray-100 focus:border-teal-500 focus:bg-white hover:border-gray-200'
                  }`}
                  placeholder=" "
                />
                <label 
                  htmlFor="email" 
                  className={`absolute left-14 transition-all duration-300 pointer-events-none font-bold
                    ${focusStates.email || formData.email ? `top-2 text-xs ${fieldErrors.email ? 'text-red-500' : 'text-teal-500'}` : 'top-4 text-sm text-gray-400'}`}
                >
                  Email Address
                </label>
                {fieldErrors.email && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 ml-2 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Floating Label Input: Phone */}
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300 ${fieldErrors.phone ? 'text-red-500' : focusStates.phone || formData.phone ? 'text-teal-500' : 'text-gray-400'}`}>
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onFocus={() => handleFocus('phone')}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full pl-14 pr-4 pt-6 pb-2 rounded-2xl text-base font-semibold text-gray-800 focus:outline-none transition-all shadow-sm peer ${
                    fieldErrors.phone
                      ? 'border-2 border-red-400 bg-red-50/20 focus:border-red-500'
                      : 'bg-gray-50/50 border-2 border-gray-100 focus:border-teal-500 focus:bg-white hover:border-gray-200'
                  }`}
                  placeholder=" "
                />
                <label 
                  htmlFor="phone" 
                  className={`absolute left-14 transition-all duration-300 pointer-events-none font-bold
                    ${focusStates.phone || formData.phone ? `top-2 text-xs ${fieldErrors.phone ? 'text-red-500' : 'text-teal-500'}` : 'top-4 text-sm text-gray-400'}`}
                >
                  Phone Number
                </label>
                {fieldErrors.phone && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 ml-2 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              {/* Floating Label Input: Password */}
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300 ${fieldErrors.pass ? 'text-red-500' : focusStates.pass || formData.pass ? 'text-teal-500' : 'text-gray-400'}`}>
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={formData.pass}
                  onChange={(e) => handleChange('pass', e.target.value)}
                  onFocus={() => handleFocus('pass')}
                  onBlur={() => handleBlur('pass')}
                  className={`w-full pl-14 pr-4 pt-6 pb-2 rounded-2xl text-base font-semibold text-gray-800 focus:outline-none transition-all shadow-sm peer ${
                    fieldErrors.pass
                      ? 'border-2 border-red-400 bg-red-50/20 focus:border-red-500'
                      : 'bg-gray-50/50 border-2 border-gray-100 focus:border-teal-500 focus:bg-white hover:border-gray-200'
                  }`}
                  placeholder=" "
                />
                <label 
                  htmlFor="password" 
                  className={`absolute left-14 transition-all duration-300 pointer-events-none font-bold
                    ${focusStates.pass || formData.pass ? `top-2 text-xs ${fieldErrors.pass ? 'text-red-500' : 'text-teal-500'}` : 'top-4 text-sm text-gray-400'}`}
                >
                  Password
                </label>
                {fieldErrors.pass && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 ml-2 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {fieldErrors.pass}
                  </p>
                )}
              </div>

              {/* Floating Label Input: Confirm Password */}
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300 ${fieldErrors.confirmPass ? 'text-red-500' : focusStates.confirmPass || formData.confirmPass ? 'text-teal-500' : 'text-gray-400'}`}>
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPass}
                  onChange={(e) => handleChange('confirmPass', e.target.value)}
                  onFocus={() => handleFocus('confirmPass')}
                  onBlur={() => handleBlur('confirmPass')}
                  className={`w-full pl-14 pr-4 pt-6 pb-2 rounded-2xl text-base font-semibold text-gray-800 focus:outline-none transition-all shadow-sm peer ${
                    fieldErrors.confirmPass
                      ? 'border-2 border-red-400 bg-red-50/20 focus:border-red-500'
                      : 'bg-gray-50/50 border-2 border-gray-100 focus:border-teal-500 focus:bg-white hover:border-gray-200'
                  }`}
                  placeholder=" "
                />
                <label 
                  htmlFor="confirmPassword" 
                  className={`absolute left-14 transition-all duration-300 pointer-events-none font-bold
                    ${focusStates.confirmPass || formData.confirmPass ? `top-2 text-xs ${fieldErrors.confirmPass ? 'text-red-500' : 'text-teal-500'}` : 'top-4 text-sm text-gray-400'}`}
                >
                  Confirm Password
                </label>
                {fieldErrors.confirmPass && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 ml-2 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {fieldErrors.confirmPass}
                  </p>
                )}
              </div>

              <div className="flex items-center px-1 pt-1 mb-2">
                <label className="flex items-center group cursor-pointer">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer w-5 h-5 opacity-0 absolute cursor-pointer" required checked={formData.terms} onChange={(e) => handleChange('terms', e.target.checked)} />
                    <div className="w-5 h-5 rounded-lg border-2 border-gray-300 bg-white peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-all flex items-center justify-center shadow-sm">
                       <CheckCircle2 className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-transform scale-50 peer-checked:scale-100" strokeWidth={3} />
                    </div>
                  </div>
                  <span className="ml-3 text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">I agree to the Terms of Service and Privacy Policy</span>
                </label>
              </div>
              
              <div className="flex items-center px-1 mb-2">
                <label className="flex items-center group cursor-pointer">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer w-5 h-5 opacity-0 absolute cursor-pointer" checked={formData.marketing} onChange={(e) => handleChange('marketing', e.target.checked)} />
                    <div className="w-5 h-5 rounded-lg border-2 border-gray-300 bg-white peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-all flex items-center justify-center shadow-sm">
                       <CheckCircle2 className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-transform scale-50 peer-checked:scale-100" strokeWidth={3} />
                    </div>
                  </div>
                  <span className="ml-3 text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">I would like to receive WINGS updates and useful resources</span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative flex items-center justify-center py-4 px-6 bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-2xl font-black text-base shadow-[0_8px_20px_-6px_rgba(20,184,166,0.5)] hover:shadow-[0_12px_25px_-8px_rgba(20,184,166,0.7)] hover:-translate-y-1 transition-all duration-300 overflow-hidden mt-2 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? 'Creating Account...' : 'Create Account'} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </form>

          </div>

          <p className="mt-8 text-center text-sm text-gray-500 font-bold">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 hover:text-teal-500 transition-colors relative inline-block group">
              Log in here
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Register;
