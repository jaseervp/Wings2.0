import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCog, Baby, Brain, 
  Stethoscope, CalendarDays, Utensils, Activity, 
  ShoppingBag, Library, LineChart, CreditCard, 
  Bell, ShieldAlert, Settings, LogOut, Menu, X, Heart, Search, CheckCircle2, Shield
} from 'lucide-react';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for top header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard, category: 'PLATFORM' },
    
    { name: 'Parents & Users', href: '/admin/users', icon: Users, category: 'USER MANAGEMENT' },
    { name: 'Professionals', href: '/admin/therapists', icon: Stethoscope, category: 'USER MANAGEMENT' },
    { name: 'Children', href: '/admin/children', icon: Baby, category: 'USER MANAGEMENT' },
    
    { name: 'Assessments', href: '/admin/assessments', icon: Brain, category: 'CLINICAL' },
    { name: 'Consultations', href: '/admin/consultations', icon: CalendarDays, category: 'CLINICAL' },
    { name: 'Diet Plans', href: '/admin/diet-plans', icon: Utensils, category: 'CLINICAL' },
    { name: 'Exercise', href: '/admin/exercise', icon: Activity, category: 'CLINICAL' },
    
    { name: 'Store', href: '/admin/store', icon: ShoppingBag, category: 'CONTENT & COMMERCE' },
    { name: 'Information Hub', href: '/admin/info-hub', icon: Library, category: 'CONTENT & COMMERCE' },
    
    { name: 'Analytics', href: '/admin/analytics', icon: LineChart, category: 'SYSTEM' },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard, category: 'SYSTEM' },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell, category: 'SYSTEM' },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert, category: 'SYSTEM' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, category: 'SYSTEM' },
  ];

  // Group navigation items
  const groupedNav = navigation.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex selection:bg-primary/20 selection:text-primary">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-lg lg:shadow-none`}>
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-50 shrink-0">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="p-2 bg-slate-900 rounded-xl group-hover:bg-slate-800 transition-colors shadow-sm">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-admin-heading font-black text-gray-900 tracking-tight block">Wings Health</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mt-0.5">Admin Portal</span>
            </div>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden ml-auto p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
          {Object.entries(groupedNav).map(([category, items]) => (
            <div key={category}>
              <h3 className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                {category}
              </h3>
              <ul className="space-y-1">
                {items.map((item) => {
                  const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                          isActive 
                            ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 text-white' : 'group-hover:scale-110 text-gray-400 group-hover:text-gray-600'}`} />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <Link to="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white transition-colors group cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-sm">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-black text-sm shadow-md">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 truncate group-hover:text-primary transition-colors">Super Admin</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider truncate flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> System Live</p>
            </div>
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors shrink-0" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen lg:pl-64 overflow-hidden relative">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none -z-10" />

        {/* Top Header */}
        <header className={`h-20 shrink-0 sticky top-0 z-40 transition-all duration-300 px-4 sm:px-8 flex items-center justify-between ${
          scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-transparent'
        }`}>
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Global Search */}
            <div className="hidden sm:flex max-w-md w-full relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400 group-focus-within:text-slate-900 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search users, assessments, transactions..." 
                className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 shadow-sm transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <span className="text-xs">⌘</span> F
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 ml-4 shrink-0">

            {/* Notification Center */}
            <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">3</span>
            </button>

            {/* Profile Dropdown Trigger */}
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-black text-gray-800 group-hover:text-primary transition-colors">Admin Workspace</p>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Online</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-black shadow-md border-2 border-white ring-2 ring-transparent group-hover:ring-slate-900/20 transition-all">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
