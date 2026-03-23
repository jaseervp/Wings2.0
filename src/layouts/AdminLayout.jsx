import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, LayoutDashboard, Users, UserCheck, Baby, 
  Stethoscope, ClipboardList, Brain, FileBarChart, Video, Activity, Salad, 
  Dumbbell, ShoppingBag, Newspaper, Bell, BarChart3, CreditCard, Settings, 
  ScrollText, Plus, Search, LogOut 
} from 'lucide-react';
import { cn } from './DashboardLayout';

const SIDEBAR_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard }
    ]
  },
  {
    label: 'User Management',
    items: [
      { name: 'All Users', path: '/admin/users', icon: Users },
      { name: 'Parents', path: '/admin/parents', icon: UserCheck },
      { name: 'Children Profiles', path: '/admin/children', icon: Baby },
      { name: 'Therapists', path: '/admin/therapists', icon: Stethoscope },
    ]
  },
  {
    label: 'Assessments',
    items: [
      { name: 'Preliminary Tests', path: '/admin/assessments', icon: ClipboardList },
      { name: 'IQ Test Results', path: '/admin/iq-tests', icon: Brain },
      { name: 'Reports', path: '/admin/reports', icon: FileBarChart },
    ]
  },
  {
    label: 'Clinical',
    items: [
      { name: 'Consultations', path: '/admin/consultations', icon: Video },
      { name: 'Therapy Sessions', path: '/admin/therapy-sessions', icon: Activity },
      { name: 'Diet Plans', path: '/admin/diet-plans', icon: Salad },
      { name: 'Exercise Programs', path: '/admin/exercise', icon: Dumbbell },
    ]
  },
  {
    label: 'Platform',
    items: [
      { name: 'Store Management', path: '/admin/store', icon: ShoppingBag },
      { name: 'Info Hub Content', path: '/admin/info-hub', icon: Newspaper },
      { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    ]
  },
  {
    label: 'System',
    items: [
      { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
      { name: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
      { name: 'Audit Logs', path: '/admin/audit-logs', icon: ScrollText },
    ]
  }
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Helper to find title
  const currentTitle = SIDEBAR_SECTIONS.flatMap(s => s.items).find(i => i.path === location.pathname)?.name || 'Admin Panel';

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-admin-body text-text overflow-hidden">
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-admin-bg text-gray-300 flex flex-col transition-all duration-300 shrink-0 border-r border-admin-bg h-full z-50",
          collapsed ? "w-[64px]" : "w-[260px]"
        )}
      >
        {/* Logo & Toggle */}
        <div className="h-16 flex items-center justify-between px-4 sticky top-0 bg-admin-bg z-10 shadow-sm border-b border-white/5">
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2 group">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-primary group-hover:scale-110 transition-transform">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#fff" opacity="0.2"/>
                <path d="M11 7h2v5.59l4 3.25-1.25 1.5-5-4.09V7z" fill="#fff"/>
              </svg>
              <span className="font-admin-heading font-extrabold text-lg text-white tracking-tight">Wings Admin</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors absolute right-[-12px] top-1/2 -translate-y-1/2 shadow-xl border border-white/10"
          >
           {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <nav className="space-y-6 px-3">
            {SIDEBAR_SECTIONS.map((section, idx) => (
              <div key={idx}>
                {!collapsed && (
                  <h4 className="px-3 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
                    {section.label}
                  </h4>
                )}
                <ul className="space-y-1">
                  {section.items.map((item, i) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={i}>
                        <Link
                          to={item.path}
                          title={collapsed ? item.name : undefined}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                            isActive 
                              ? "bg-primary/10 text-primary border-l-2 border-primary border-r-2 border-transparent" 
                              : "text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent border-r-2 border-transparent"
                          )}
                        >
                          <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-gray-400 group-hover:text-white")} />
                          {!collapsed && <span className="truncate">{item.name}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/5 bg-admin-bg/95">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
              <span className="text-accent font-bold text-sm">S</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">System Auth</p>
                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Super Admin</p>
              </div>
            )}
            {!collapsed && (
              <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen min-w-0">
        
        {/* Top Navbar */}
        <header className="h-[64px] bg-white border-b border-admin-border flex items-center justify-between px-6 shrink-0 z-40 sticky top-0 shadow-sm">
          <div className="flex items-center gap-4 w-1/3">
            <h1 className="font-admin-heading font-bold text-xl text-admin-bg">{currentTitle}</h1>
            <div className="hidden lg:flex items-center gap-2 text-sm text-muted">
              <span>Admin</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-text font-medium">{currentTitle}</span>
            </div>
          </div>

          <div className="flex-1 flex justify-center px-4">
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search users, assessments..." 
                className="w-full pl-9 pr-12 py-2 bg-gray-50 border border-admin-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden sm:inline-block border border-gray-200 rounded px-1.5 text-[10px] font-bold text-gray-400 font-mono bg-white">Cmd+K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 w-1/3">
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors rounded-lg text-sm font-bold border border-primary/20">
              <Plus className="w-4 h-4" /> New
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <button className="relative p-2 text-gray-400 hover:text-text rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-admin-danger rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-6 scroll-smooth">
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default AdminLayout;
