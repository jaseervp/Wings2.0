import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Heart, LayoutDashboard, Users, ClipboardList, 
  Puzzle, Video, CalendarDays, MessageSquare, 
  LineChart, FileOutput, BrainCircuit, Settings,
  LogOut, Menu, X, Search, Bell, Sparkles, Plus, CheckCircle2, Apple
} from 'lucide-react';

const DoctorLayout = () => {
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
    { name: 'Dashboard', href: '/doctor', icon: LayoutDashboard, category: 'OVERVIEW' },
    { name: 'Assigned Children', href: '/doctor/children', icon: Users, category: 'PATIENT CARE' },
    { name: 'Assessments', href: '/doctor/assessments', icon: ClipboardList, category: 'PATIENT CARE' },
    { name: 'Therapy Plans', href: '/doctor/therapy-plans', icon: Puzzle, category: 'PATIENT CARE' },
    { name: 'Diet Plans', href: '/doctor/diet-plans', icon: Apple, category: 'PATIENT CARE' },
    { name: 'Video Reviews', href: '/doctor/videos', icon: Video, category: 'PATIENT CARE' },
    { name: 'Appointments', href: '/doctor/appointments', icon: CalendarDays, category: 'SCHEDULE & COMMS' },
    { name: 'Parent Communication', href: '/doctor/communication', icon: MessageSquare, category: 'SCHEDULE & COMMS' },
    { name: 'Progress Analytics', href: '/doctor/analytics', icon: LineChart, category: 'DATA & INSIGHTS' },
    { name: 'Reports', href: '/doctor/reports', icon: FileOutput, category: 'DATA & INSIGHTS' },
    { name: 'AI Insights', href: '/doctor/insights', icon: BrainCircuit, category: 'DATA & INSIGHTS' },
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
          <Link to="/doctor" className="flex items-center gap-3 group">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Heart className="w-6 h-6 text-primary fill-primary/20" />
            </div>
            <div>
              <span className="text-xl font-admin-heading font-black text-gray-900 tracking-tight block">Wings Health</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mt-0.5">Clinical Portal</span>
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
                  const isActive = location.pathname === item.href || (item.href !== '/doctor' && location.pathname.startsWith(item.href));
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                          isActive 
                            ? 'bg-blue-50/80 text-primary shadow-sm ring-1 ring-blue-100/50' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 text-primary' : 'group-hover:scale-110 text-gray-400 group-hover:text-gray-600'}`} />
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
          <Link to="/doctor/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white transition-colors group cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-sm">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md">
              SS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 truncate group-hover:text-primary transition-colors">Dr. Sarah Smith</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate">Speech Therapist</p>
            </div>
            <Settings className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors shrink-0" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen lg:pl-64 overflow-hidden relative">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none -z-10" />

        {/* Top Header */}
        <header className={`h-20 shrink-0 sticky top-0 z-40 transition-all duration-300 px-4 sm:px-8 flex items-center justify-between ${
          scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-transparent'
        }`}>
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Global & Smart Patient Search */}
            <div className="hidden sm:flex max-w-md w-full relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search patients, assessments, or therapies..." 
                className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <span className="text-xs">⌘</span> K
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 ml-4 shrink-0">
            {/* Quick Action Button */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-full shadow-sm transition-all">
              <Plus className="w-4 h-4" /> New Plan
            </button>

            {/* AI Assistant Shortcut */}
            <button className="relative p-2.5 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors group">
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Messages */}
            <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors group">
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">2</span>
            </button>

            {/* Notification Center */}
            <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Profile Dropdown Trigger */}
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-black text-gray-800 group-hover:text-primary transition-colors">Dr. Sarah</p>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Available</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-black shadow-md border-2 border-white ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                SS
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

export default DoctorLayout;
