import { Link } from 'react-router-dom';
import { Mail, Lock, Heart } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-bg">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Heart className="text-primary h-8 w-8 fill-primary/20" />
            </div>
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-text">Welcome Back</h2>
          <p className="text-muted mt-2">Sign in to track your child's progress</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-text mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="parent@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-text">Password</label>
              <a href="#" className="font-semibold text-sm text-primary hover:text-primary/80">Forgot?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Link to="/dashboard" className="w-full block text-center py-3.5 px-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:shadow-primary/40 transition-all">
            Sign In
          </Link>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted">Or continue with</span>
            </div>
          </div>
          
          <button type="button" className="w-full flex justify-center items-center py-3.5 px-4 border-2 border-gray-100 rounded-xl font-bold text-text bg-white hover:bg-gray-50 transition-all gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text font-medium">
          New to Wings?{' '}
          <Link to="/register" className="text-secondary hover:text-secondary/80 font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
