import { Outlet, Link, useLocation } from 'react-router-dom';
import { Heart, Twitter, Instagram, Facebook, ArrowRight } from 'lucide-react';

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={`min-h-screen flex flex-col font-body ${isAuthPage ? 'bg-[#f3f6f9]' : 'bg-bg text-text'}`}>
      
      {/* Navbar - Premium Floating Pill (Hidden on Auth Pages) */}
      {!isAuthPage && (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 px-4 pointer-events-none">
          <nav className="pointer-events-auto w-full max-w-6xl bg-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] py-3 px-6 flex items-center justify-between transition-all duration-500">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-indigo-50/80 rounded-[14px] group-hover:bg-indigo-100 transition-colors shadow-sm">
                 <Heart className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform duration-300 fill-indigo-600/20" />
              </div>
              <span className="font-heading font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-teal-600 tracking-tight drop-shadow-sm">Wings</span>
            </Link>
        
            <div className="hidden md:flex items-center gap-8 font-semibold text-gray-600">
              <Link to="/#features" className="hover:text-indigo-600 transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
              <Link to="/#testimonials" className="hover:text-indigo-600 transition-colors relative group">
                Stories
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
              <Link to="/#pricing" className="hover:text-indigo-600 transition-colors relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden sm:block font-bold text-gray-600 hover:text-indigo-600 transition-colors px-2">Log in</Link>
              <Link to="/register" className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_25px_-8px_rgba(79,70,229,0.7)] hover:-translate-y-0.5">
                 Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </nav>
        </div>
      )}

      <main className="flex-1 w-full pt-4">
        <Outlet />
      </main>

      {/* Footer - Premium Minimalist (Hidden on Auth Pages) */}
      {!isAuthPage && (
        <footer className="relative overflow-hidden bg-gray-50/80 backdrop-blur-sm py-16 mt-20 border-t border-gray-200 px-6 sm:px-12">
          {/* Decorative subtle background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none rounded-full blur-3xl"></div>
        
          <div className="max-w-7xl mx-auto relative z-10">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-gray-200/60 mb-8">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-100 rounded-xl">
                   <Heart className="h-5 w-5 text-indigo-600 fill-indigo-600/30" />
                 </div>
                 <span className="font-heading font-black text-xl text-gray-900 tracking-tight">Wings Mental Health</span>
               </div>
               
               <div className="flex gap-4">
                 <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all group">
                   <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                 </a>
                 <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-pink-600 hover:border-pink-200 hover:shadow-md transition-all group">
                   <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                 </a>
                 <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all group">
                   <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
                 </a>
               </div>
             </div>

             <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-500">
               <p>© {new Date().getFullYear()} Wings Mental Health. Empowering parents, supporting children.</p>
               <div className="flex gap-6">
                 <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
                 <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
                 <a href="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</a>
               </div>
             </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default MainLayout;
