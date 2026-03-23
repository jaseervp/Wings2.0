import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ClipboardList, Brain, HeartHandshake, 
  Apple, Dumbbell, Store, LibraryBig, Settings, Bell, ChevronDown, Menu, X 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
  { name: 'Consultation', path: '/consultation', icon: HeartHandshake }, // Need better icon maybe
  { name: 'Store', path: '/store', icon: Store },
  { name: 'Info Hub', path: '/info-hub', icon: LibraryBig },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 w-64">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="font-heading font-extrabold text-2xl text-primary tracking-tight">Wings</span>
        </Link>
      </div>

      <div className="px-4 pb-4">
        {/* Child Profile Mini-Card */}
        <div className="bg-bg rounded-xl p-3 flex items-center gap-3 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text truncate">Aarav</p>
            <p className="text-xs text-muted">4 yrs old</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted" />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {SIDEBAR_LINKS.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary font-semibold" 
                  : "text-muted hover:bg-gray-50 hover:text-text"
              )}
            >
              <link.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted")} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg flex font-body">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 -ml-2 rounded-md justify-center text-muted hover:bg-gray-100 lg:hidden"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="font-heading font-bold text-xl hidden sm:block">
              {SIDEBAR_LINKS.find(l => location.pathname.startsWith(l.path))?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted hover:bg-gray-50 rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-secondary"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent cursor-pointer border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">
              P
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
