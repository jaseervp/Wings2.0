import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Heart, ChevronRight, CheckCircle2, User, UserPlus, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Simple floating animation logic
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'THERAPIST') navigate('/doctor');
      else {
        if (user.onboardingStatus === 'NOT_STARTED' || user.onboardingStatus === 'IN_PROGRESS') {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setErrorMsg('Unable to sign in. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f9] flex font-sans selection:bg-indigo-500/30 selection:text-indigo-900 overflow-hidden relative">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-indigo-200/50 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] bg-teal-200/50 rounded-full blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
      
      {/* ================================================== */}
      {/* LEFT SIDE: PREMIUM BRANDING & ARTWORK                */}
      {/* ================================================== */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-teal-400 rounded-r-[60px] shadow-[20px_0_60px_-15px_rgba(0,0,0,0.1)]">
        
        {/* Animated Inner Elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2)_0%,transparent_60%)] pointer-events-none"></div>
        
        {/* Top: Navbar Area */}
        <div className="relative z-20 flex justify-between items-center w-full">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl group-hover:bg-white/25 transition-all duration-300 border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-105 group-hover:rotate-3">
              <Heart className="w-7 h-7 text-white fill-white/40 group-hover:fill-white/60 transition-colors" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight drop-shadow-sm font-admin-heading">Wings</span>
          </Link>

          <div className="flex gap-4">
            <a href="#" className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-semibold transition-all shadow-sm">
              Support
            </a>
          </div>
        </div>

        {/* Middle: Content */}
        <div 
          className="relative z-20 w-full max-w-lg mt-12 transition-transform duration-700 ease-out"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-bold tracking-wide mb-6 border border-white/30 backdrop-blur-md">
              A Healthier Tomorrow
            </span>
            <h1 className="text-5xl font-black text-white leading-[1.1] mb-6 drop-shadow-md">
              Nurturing Child <br/> Development
            </h1>
            <p className="text-indigo-100 text-lg leading-relaxed font-medium max-w-md">
              Join a community of parents and healthcare professionals dedicated to tracking and enhancing early childhood milestones with precision and care.
            </p>
            
            {/* Visual Decorative elements */}
            <div className="mt-10 flex items-center gap-4">
               <div className="flex -space-x-4">
                 {[1, 2, 3, 4].map((i) => (
                   <div key={i} className={`w-12 h-12 rounded-full border-2 border-indigo-400 bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg`}>
                     <User className="w-5 h-5 text-white" />
                   </div>
                 ))}
               </div>
               <p className="text-white font-semibold text-sm">
                 Trusted by <br/><span className="text-teal-200">10,000+ Users</span>
               </p>
            </div>
          </div>
        </div>

        {/* Bottom: Footer Info */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between text-white/80 text-sm font-medium w-full border-t border-white/20 pt-6">
          <p className="mb-4 sm:mb-0">© 2026 Wings Healthcare. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <a href="#" className="hover:text-white hover:underline transition-all decoration-white/50 underline-offset-4">Privacy Policy</a>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <a href="#" className="hover:text-white hover:underline transition-all decoration-white/50 underline-offset-4">Terms of Service</a>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <a href="#" className="hover:text-white hover:underline transition-all decoration-white/50 underline-offset-4">Contact</a>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* RIGHT SIDE: INTERACTIVE AUTH CARD                    */}
      {/* ================================================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-20">
        
        {/* Mobile Header */}
        <div className="absolute top-6 left-6 lg:hidden z-30">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-600/10 rounded-xl group-hover:bg-indigo-600/20 transition-all">
              <Heart className="w-6 h-6 text-indigo-600 fill-indigo-600/20" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">Wings</span>
          </Link>
        </div>

        <div className="w-full max-w-[460px] animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
          
          <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white p-8 sm:p-10 lg:p-12 relative">
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome Back 👋</h2>
              <p className="text-gray-500 font-medium text-sm">
                Sign in to your account to continue
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Floating Label Input: Email */}
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300 ${emailFocus || email ? 'text-indigo-500' : 'text-gray-400'}`}>
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  required
                  className="w-full pl-14 pr-4 pt-6 pb-2 bg-gray-50/50 border-2 border-gray-100 rounded-2xl text-base font-semibold text-gray-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm peer hover:border-gray-200"
                  placeholder=" "
                />
                <label 
                  htmlFor="email" 
                  className={`absolute left-14 transition-all duration-300 pointer-events-none font-bold
                    ${emailFocus || email ? 'top-2 text-xs text-indigo-500' : 'top-4 text-sm text-gray-400'}`}
                >
                  Email Address
                </label>
              </div>

              {/* Floating Label Input: Password */}
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300 ${passFocus || password ? 'text-indigo-500' : 'text-gray-400'}`}>
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPassFocus(true)}
                  onBlur={() => setPassFocus(false)}
                  required
                  className="w-full pl-14 pr-4 pt-6 pb-2 bg-gray-50/50 border-2 border-gray-100 rounded-2xl text-base font-semibold text-gray-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm peer hover:border-gray-200"
                  placeholder=" "
                />
                <label 
                  htmlFor="password" 
                  className={`absolute left-14 transition-all duration-300 pointer-events-none font-bold
                    ${passFocus || password ? 'top-2 text-xs text-indigo-500' : 'top-4 text-sm text-gray-400'}`}
                >
                  Password
                </label>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center group cursor-pointer">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer w-5 h-5 opacity-0 absolute cursor-pointer" />
                    <div className="w-5 h-5 rounded-lg border-2 border-gray-300 bg-white peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all flex items-center justify-center shadow-sm">
                       <CheckCircle2 className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-transform scale-50 peer-checked:scale-100" strokeWidth={3} />
                    </div>
                  </div>
                  <span className="ml-3 text-sm font-bold text-gray-500 group-hover:text-gray-800 transition-colors">Remember Me</span>
                </label>

                <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot Password?
                </a>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative flex items-center justify-center py-4 px-6 bg-indigo-600 text-white rounded-2xl font-black text-base shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_25px_-8px_rgba(79,70,229,0.7)] hover:-translate-y-1 transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? 'Signing In...' : 'Sign In to Dashboard'} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </form>

          </div>

          <p className="mt-8 text-center text-sm text-gray-500 font-bold">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-500 transition-colors relative inline-block group">
              Create one now
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;
