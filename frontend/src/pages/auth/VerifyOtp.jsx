import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const verificationId = location.state?.verificationId;
  const maskedDestination = location.state?.maskedDestination || 'your email';
  const expiresIn = location.state?.expiresIn || 300;

  const [timeLeft, setTimeLeft] = useState(expiresIn);

  useEffect(() => {
    if (!verificationId) {
      navigate('/register');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [verificationId, navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').slice(0, 6).split('');
    if (pasteData.some(isNaN)) return;
    
    const newOtp = [...otp];
    pasteData.forEach((char, index) => {
      newOtp[index] = char;
    });
    setOtp(newOtp);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await verifyOtp({ verificationId, otp: code });
      setSuccessMsg(res.message || 'Account verified successfully.');
      setTimeout(() => {
        if (res.data && res.data.user) {
          const user = res.data.user;
          if (user.role === 'ADMIN') navigate('/admin');
          else if (user.role === 'THERAPIST') navigate('/doctor');
          else {
            if (user.onboardingStatus === 'NOT_STARTED' || user.onboardingStatus === 'IN_PROGRESS') {
              navigate('/onboarding');
            } else {
              navigate('/dashboard');
            }
          }
        } else {
          navigate('/login');
        }
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await resendOtp({ verificationId });
      setSuccessMsg(res.message || 'Code resent.');
      setTimeLeft(res.data?.expiresIn || 300);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50/50">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link to="/register" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Signup
          </Link>
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Verify Your Account</h2>
            <p className="text-lg text-gray-500 font-medium">
              We've sent a 6-digit verification code to:<br/>
              <span className="font-bold text-gray-800">{maskedDestination}</span>
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-indigo-100/50 border border-white">
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

            <form onSubmit={handleVerify} className="space-y-8">
              <div className="flex justify-center gap-3">
                {otp.map((data, index) => (
                  <input
                    className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    type="text"
                    name="otp"
                    maxLength="1"
                    key={index}
                    value={data}
                    onChange={e => handleChange(e.target, index)}
                    onFocus={e => e.target.select()}
                    onPaste={handlePaste}
                    onKeyDown={e => handleKeyDown(e, index)}
                  />
                ))}
              </div>

              <div className="text-center">
                <p className={`text-sm font-bold ${timeLeft > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                  {timeLeft > 0 ? `Code expires in ${formatTime(timeLeft)}` : 'OTP expired.'}
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.join('').length < 6}
                className="w-full group relative flex items-center justify-center py-4 px-6 bg-indigo-600 text-white rounded-2xl font-black text-base shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_25px_-8px_rgba(79,70,229,0.7)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? 'Verifying...' : 'Verify Account'} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 font-medium">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timeLeft > 0}
                  className={`font-bold transition-colors ${timeLeft > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-500'}`}
                >
                  Resend Code
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
