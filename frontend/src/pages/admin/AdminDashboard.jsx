import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Baby, Brain, Stethoscope, ShoppingBag, 
  DollarSign, ArrowUpRight, ArrowDownRight, Activity, 
  Target, ShieldCheck, ChevronRight, FileText, Download, TrendingUp, Sparkles, AlertCircle
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

// Mock Data for Sparklines
const sparklineUsers = [{ value: 400 }, { value: 430 }, { value: 480 }, { value: 500 }, { value: 550 }, { value: 580 }, { value: 620 }];
const sparklineChildren = [{ value: 120 }, { value: 140 }, { value: 130 }, { value: 160 }, { value: 180 }, { value: 190 }, { value: 210 }];
const sparklineAssessments = [{ value: 30 }, { value: 25 }, { value: 40 }, { value: 35 }, { value: 50 }, { value: 45 }, { value: 60 }];
const sparklineRevenue = [{ value: 100 }, { value: 150 }, { value: 120 }, { value: 200 }, { value: 180 }, { value: 250 }, { value: 300 }];

const KPI_CARDS = [
  { 
    title: 'Total Users (Parents)', 
    count: '2,847', 
    trend: '+12% this month',
    trendUp: true,
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    sparkline: sparklineUsers,
    sparklineColor: '#3B82F6'
  },
  { 
    title: 'Total Children', 
    count: '1,203', 
    trend: '+8% this month',
    trendUp: true,
    icon: Baby,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    sparkline: sparklineChildren,
    sparklineColor: '#6366F1'
  },
  { 
    title: 'Assessments Completed', 
    count: '842', 
    trend: '+24% this week',
    trendUp: true,
    icon: Brain,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    sparkline: sparklineAssessments,
    sparklineColor: '#10B981'
  },
  { 
    title: 'Monthly Revenue', 
    count: '₹4.2L', 
    trend: '-2% this month',
    trendUp: false,
    icon: DollarSign,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    sparkline: sparklineRevenue,
    sparklineColor: '#F59E0B'
  }
];

const RECENT_USERS = [
  { id: 1, name: 'Priya Sharma', email: 'priya@email.com', type: 'Parent', status: 'Active', time: '10 mins ago' },
  { id: 2, name: 'Dr. Rahul Varma', email: 'v.rahul@email.com', type: 'Therapist', status: 'Pending', time: '1 hour ago' },
  { id: 3, name: 'Sneha M', email: 'sm@email.com', type: 'Parent', status: 'Active', time: '3 hours ago' },
  { id: 4, name: 'Apollo Clinic', email: 'admin@apollo.com', type: 'Organization', status: 'Active', time: 'Yesterday' },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8 pb-10">
      
      {/* ------------------------------------------------ */}
      {/* EXECUTIVE OVERVIEW HERO                          */}
      {/* ------------------------------------------------ */}
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-100/80 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between gap-8">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white text-xs font-black rounded-full uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Platform Secure
            </div>
            <h1 className="text-3xl sm:text-4xl font-admin-heading font-black text-gray-900 tracking-tight mb-2">
              Welcome back, Admin 👋
            </h1>
            <p className="text-gray-500 font-medium text-base sm:text-lg mb-8">
              Here's the operational overview for Wings Health today. Platform activity is up by <span className="font-bold text-emerald-600">14%</span> compared to last week.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-sm shadow-slate-900/20 hover:bg-slate-800 hover:scale-105 transition-all flex items-center gap-2">
                <Users className="w-5 h-5" /> Manage Users
              </button>
              <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all flex items-center gap-2">
                <FileText className="w-5 h-5" /> Generate Report
              </button>
              <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all flex items-center gap-2">
                <Download className="w-5 h-5" /> Export Data
              </button>
            </div>
          </div>

          {/* Platform Health Scores */}
          <div className="flex gap-4 shrink-0">
            <div className="flex flex-col justify-center p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white shadow-lg w-48 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors"></div>
              <Activity className="w-6 h-6 text-emerald-400 mb-4" />
              <p className="text-3xl font-black mb-1">98.2%</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Platform Health</p>
            </div>
            
            <div className="flex flex-col gap-4">
               <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4 w-48 hover:border-blue-200 transition-colors">
                  <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900">14k</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Weekly Activity</p>
                  </div>
               </div>
               <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4 w-48 hover:border-indigo-200 transition-colors">
                  <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900">124</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Pros</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* PREMIUM KPI CARDS                                */}
      {/* ------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100 fill-mode-both">
        {KPI_CARDS.map((stat, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all group relative overflow-hidden cursor-pointer hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend.split(' ')[0]}
              </div>
            </div>
            
            <h3 className="text-gray-500 font-bold text-sm mb-1">{stat.title}</h3>
            <p className="text-3xl font-admin-heading font-black text-gray-900 tracking-tight mb-4 group-hover:text-primary transition-colors">{stat.count}</p>
            
            <div className="h-10 w-full opacity-50 group-hover:opacity-100 transition-opacity">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={stat.sparkline}>
                   <defs>
                     <linearGradient id={`color-${index}`} x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor={stat.sparklineColor} stopOpacity={0.3}/>
                       <stop offset="95%" stopColor={stat.sparklineColor} stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Area type="monotone" dataKey="value" stroke={stat.sparklineColor} fillOpacity={1} fill={`url(#color-${index})`} strokeWidth={2} />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ------------------------------------------------ */}
        {/* RECENT REGISTRATIONS & ACTIVITY                  */}
        {/* ------------------------------------------------ */}
        <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-200 fill-mode-both">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-admin-heading font-black text-gray-900 tracking-tight">Recent Registrations</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Users who joined the platform recently.</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">
                 <Users className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {RECENT_USERS.map((user) => (
                <div key={user.id} className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group bg-white">
                   
                   <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-slate-100 shadow-sm flex items-center justify-center font-black text-sm text-slate-600 border border-slate-200">
                           {user.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                         </div>
                         <div>
                           <h4 className="text-base font-black text-gray-900 mb-0.5">{user.name}</h4>
                           <p className="text-xs font-bold text-gray-500">{user.email}</p>
                         </div>
                      </div>
                      
                      <div className="text-right">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{user.type}</p>
                         <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                           user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                         }`}>
                           {user.status}
                         </div>
                      </div>
                   </div>

                </div>
              ))}
            </div>

            <Link to="/admin/users" className="mt-6 w-full py-3 bg-gray-50 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
              View All Users <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* AI PLATFORM INSIGHTS & SYSTEM ALERTS             */}
        {/* ------------------------------------------------ */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300 fill-mode-both">
          
          <div className="bg-gradient-to-br from-[#0B1120] to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
            <div className="absolute -right-10 -top-10 text-indigo-500/20 pointer-events-none">
               <Brain className="w-48 h-48" />
            </div>

            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                   <Sparkles className="w-6 h-6" />
                 </div>
                 <h2 className="text-xl font-admin-heading font-black tracking-tight">AI Insights</h2>
               </div>

               <div className="space-y-4">
                  {/* Insight Card */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer">
                     <div className="flex items-start gap-3">
                       <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                       <div>
                         <h4 className="text-sm font-black text-gray-100 mb-1">Growth Prediction</h4>
                         <p className="text-xs font-medium text-gray-400 leading-relaxed mb-3">Therapist onboarding is predicted to increase by 15% next month based on recent traffic.</p>
                       </div>
                     </div>
                  </div>

                  {/* Alert Card */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer">
                     <div className="flex items-start gap-3">
                       <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                       <div>
                         <h4 className="text-sm font-black text-gray-100 mb-1">Low Engagement</h4>
                         <p className="text-xs font-medium text-gray-400 leading-relaxed mb-3">12 parents haven't logged in for over 30 days. Consider sending a re-engagement email.</p>
                       </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Storage / System Status mini widget */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-admin-heading font-black text-gray-900 tracking-tight">System Status</h2>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> All Systems Operational</span>
            </div>
            
            <div className="space-y-4 mt-6">
               <div>
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                    <span>Database Storage</span>
                    <span>45% Used</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                     <div className="bg-slate-800 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                    <span>Server Load</span>
                    <span>22% CPU</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                     <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
