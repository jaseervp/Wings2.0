import { Link } from 'react-router-dom';
import { Mail, Lock, Heart, User, Phone } from 'lucide-react';

const Register = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-bg">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-secondary/10 rounded-2xl flex items-center justify-center">
              <Heart className="text-secondary h-8 w-8 fill-secondary/20" />
            </div>
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-text">Join Wings</h2>
          <p className="text-muted mt-2">Start your child's supported journey</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-text mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="John Doe" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-text mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input type="email" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="parent@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-text mb-1.5">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input type="tel" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="+91 98765 43210" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-text mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input type="password" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="••••••••" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="parent" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
            <label htmlFor="parent" className="text-sm font-medium text-text">I am a parent/guardian</label>
          </div>

          <Link to="/add-child" className="w-full block text-center py-3.5 px-4 mt-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:shadow-primary/40 transition-all">
            Create Account
          </Link>
          
        </form>

        <p className="mt-8 text-center text-sm text-text font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary hover:text-secondary/80 font-bold hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
