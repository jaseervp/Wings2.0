import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ClipboardList, Brain, HeartHandshake, 
  Apple, Dumbbell, Store, LibraryBig, Settings, Bell, ChevronDown, Menu, X, Bot, Sparkles, MessageCircle, Baby
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { childrenApi } from '../features/onboarding/services/onboardingApi';

// Utility for Tailwind class merging
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SIDEBAR_LINKS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Assessment', path: '/assessment', icon: ClipboardList },
  { name: 'IQ Test', path: '/iq-test', icon: Brain },
  { name: 'Therapies', path: '/therapies', icon: HeartHandshake },
  { name: 'Diet Plan', path: '/diet-plan', icon: Apple },
  { name: 'Exercise', path: '/exercise', icon: Dumbbell },
  { name: 'Consultation', path: '/consultation', icon: HeartHandshake },
  { name: 'Store', path: '/store', icon: Store },
  { name: 'Info Hub', path: '/info-hub', icon: LibraryBig },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [activeChild, setActiveChild] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const loadChild = async () => {
      try {
        const res = await childrenApi.getMyChildren();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setActiveChild(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to load child in layout:', err);
      }
    };
    loadChild();
    return () => { isMounted = false; };
  }, []);

  const childName = activeChild?.preferredName || activeChild?.firstName || 'Child Profile';
  const calculateAge = (dob) => {
    if (!dob) return '';
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    return `${years} yrs old`;
  };
  const childAge = activeChild?.dateOfBirth ? calculateAge(activeChild.dateOfBirth) : '';

  const sidebarContentJSX = (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-xl border-r border-border/60 w-64 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Brain className="h-7 w-7 text-primary" />
          </div>
          <span className="font-heading font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight">
            Wings
          </span>
        </Link>
      </div>

      <div className="px-4 pb-6">
        {/* Child Profile Mini-Card */}
        <Link to="/settings" className="bg-gradient-to-br from-primary-100/50 to-secondary-100/50 rounded-2xl p-3 flex items-center gap-3 border border-white shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
          {activeChild ? (
            <img 
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(childName)}&backgroundColor=c0aede`} 
              alt={childName} 
              className="w-10 h-10 rounded-full border-2 border-white bg-white shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center shrink-0 text-primary">
              <Baby className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text truncate">{childName}</p>
            {childAge && <p className="text-xs text-primary font-medium">{childAge}</p>}
          </div>
          <ChevronDown className="h-4 w-4 text-muted shrink-0" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
        {SIDEBAR_LINKS.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/25 translate-x-1" 
                  : "text-muted hover:bg-gray-50 hover:text-text hover:translate-x-1"
              )}
            >
              <link.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-muted group-hover:text-text")} />
              {link.name}
            </Link>
          );
        })}
      </nav>
      
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border/60">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <Sparkles className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-xs font-bold text-indigo-800 mb-1 relative z-10">Upgrade to Pro</p>
          <p className="text-[10px] text-indigo-600 mb-3 relative z-10">Get personalized therapy insights.</p>
          <button className="w-full bg-white text-indigo-600 text-xs font-bold py-2 rounded-lg shadow-sm hover:shadow transition-shadow relative z-10">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg flex font-body selection:bg-primary/20 selection:text-primary">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-text/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out h-full",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {sidebarContentJSX}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Topbar */}
        <header className="glass h-[72px] flex items-center justify-between px-4 sm:px-8 z-30 shrink-0 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 -ml-2 rounded-xl justify-center text-muted hover:bg-gray-100 lg:hidden transition-colors"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="font-heading font-extrabold text-2xl hidden sm:block text-text tracking-tight">
              {SIDEBAR_LINKS.find(l => location.pathname.startsWith(l.path))?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-muted hover:bg-gray-100 hover:text-text rounded-full transition-all hover:scale-105">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-accent border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-secondary cursor-pointer border-[3px] border-white shadow-md flex items-center justify-center text-white text-sm font-bold hover:scale-105 transition-transform">
              P
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative custom-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Assistant Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isAiOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-border/50 w-80 mb-4 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Wings AI Support</h3>
                    <p className="text-xs text-white/80">Always here to help you</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 h-64 overflow-y-auto flex flex-col gap-3">
                <div className="bg-primary/10 text-text p-3 rounded-2xl rounded-tl-sm text-sm border border-primary/20">
                  Hi there! I'm your Wings assistant. How can I support you and Aarav today?
                </div>
                <div className="flex flex-col gap-2 mt-auto">
                  <button className="bg-white border border-border rounded-xl p-2 text-xs text-left text-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm">
                    How is Aarav's speech progress?
                  </button>
                  <button className="bg-white border border-border rounded-xl p-2 text-xs text-left text-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm">
                    Suggest an indoor exercise
                  </button>
                </div>
              </div>
              <div className="p-3 bg-white border-t border-border/50">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask anything..." 
                    className="w-full bg-gray-50 border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAiOpen(!isAiOpen)}
          className="h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          {isAiOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        </motion.button>
      </div>
    </div>
  );
};

export default DashboardLayout;

