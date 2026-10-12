import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, CalendarDays, Video, ClipboardList, 
  TrendingUp, TrendingDown, Clock, MessageSquare, 
  ChevronRight, BrainCircuit, AlertCircle, FileText,
  Activity, ArrowUpRight, ArrowDownRight, Sparkles, Plus, PlayCircle, Star, Target, ArrowRight
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock Data for Sparklines
const sparklineData1 = [{ value: 40 }, { value: 35 }, { value: 45 }, { value: 42 }, { value: 50 }, { value: 55 }, { value: 52 }];
const sparklineData2 = [{ value: 10 }, { value: 12 }, { value: 11 }, { value: 15 }, { value: 13 }, { value: 16 }, { value: 18 }];
const sparklineData3 = [{ value: 20 }, { value: 18 }, { value: 15 }, { value: 12 }, { value: 14 }, { value: 10 }, { value: 8 }];
const sparklineData4 = [{ value: 5 }, { value: 7 }, { value: 6 }, { value: 8 }, { value: 10 }, { value: 12 }, { value: 15 }];

const KPI_CARDS = [
  { 
    title: 'Assigned Children', 
    count: '42', 
    trend: '+12% this month',
    trendUp: true,
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    sparkline: sparklineData1,
    sparklineColor: '#3B82F6'
  },
  { 
    title: "Today's Appointments", 
    count: '8', 
    trend: '+2 from yesterday',
    trendUp: true,
    icon: CalendarDays,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    sparkline: sparklineData2,
    sparklineColor: '#10B981'
  },
  { 
    title: 'Pending Reviews', 
    count: '12', 
    trend: '-4% this week',
    trendUp: false,
    icon: Video,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    sparkline: sparklineData3,
    sparklineColor: '#F59E0B'
  },
  { 
    title: 'Active Therapy Plans', 
    count: '18', 
    trend: '+5% this month',
    trendUp: true,
    icon: ClipboardList,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    sparkline: sparklineData4,
    sparklineColor: '#8B5CF6'
  }
];

const SCHEDULE = [
  { id: 1, patient: 'Aarav Patel', type: 'Speech Therapy', time: '10:00 AM - 10:45 AM', format: 'In-Clinic', status: 'Upcoming', color: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
  { id: 2, patient: 'Rahul Sharma', type: 'Assessment Review', time: '11:00 AM - 11:30 AM', format: 'Video Call', status: 'Upcoming', color: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  { id: 3, patient: 'Priya Singh', type: 'Parent Consultation', time: '02:00 PM - 02:45 PM', format: 'Video Call', status: 'Pending', color: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
  { id: 4, patient: 'Kabir Das', type: 'Speech Therapy', time: '03:30 PM - 04:15 PM', format: 'In-Clinic', status: 'Pending', color: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
];

const RECENT_ACTIVITY = [
  { id: 1, action: 'Video uploaded for review', patient: 'Kabir Das', time: '10 minutes ago', type: 'video' },
  { id: 2, action: 'Assessment completed', patient: 'Ananya Gupta', time: '2 hours ago', type: 'assessment' },
  { id: 3, action: 'Message from parent', patient: 'Aarav Patel', time: '4 hours ago', type: 'message' },
];

const DoctorDashboard = () => {
  return (
    <div className="space-y-8 pb-10">
      
      {/* ------------------------------------------------ */}
      {/* PROFESSIONAL WELCOME PANEL (HERO)                */}
      {/* ------------------------------------------------ */}
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between gap-8">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Workspace Overview
            </div>
            <h1 className="text-3xl sm:text-4xl font-admin-heading font-black text-gray-900 tracking-tight mb-2">
              Good Morning, Dr. Sarah 👋
            </h1>
            <p className="text-gray-500 font-medium text-base sm:text-lg mb-8">
              Here's your clinical summary for today. You have <span className="font-bold text-gray-800">8 appointments</span> and <span className="font-bold text-gray-800">12 pending reviews</span>.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-sm shadow-primary/20 hover:bg-primary/90 hover:scale-105 transition-all flex items-center gap-2">
                <CalendarDays className="w-5 h-5" /> View Full Schedule
              </button>
              <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all flex items-center gap-2">
                <FileText className="w-5 h-5" /> Generate Report
              </button>
              <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all flex items-center gap-2">
                <Video className="w-5 h-5" /> Start Consultation
              </button>
            </div>
          </div>

          {/* Productivity Scores */}
          <div className="flex gap-4 shrink-0">
            <div className="flex flex-col justify-center p-6 bg-gradient-to-br from-gray-900 to-[#0B1120] rounded-2xl text-white shadow-lg w-48 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors"></div>
              <Activity className="w-6 h-6 text-emerald-400 mb-4" />
              <p className="text-3xl font-black mb-1">94%</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Productivity Score</p>
            </div>
            
            <div className="flex flex-col gap-4">
               <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4 w-48 hover:border-blue-200 transition-colors">
                  <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900">88%</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Engagement</p>
                  </div>
               </div>
               <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4 w-48 hover:border-emerald-200 transition-colors">
                  <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900">92%</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Completion</p>
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
        {/* PROFESSIONAL CALENDAR WIDGET                     */}
        {/* ------------------------------------------------ */}
        <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-200 fill-mode-both">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-admin-heading font-black text-gray-900 tracking-tight">Today's Schedule</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">You have 8 sessions scheduled for today.</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-colors">
                 <CalendarDays className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {SCHEDULE.map((apt) => (
                <div key={apt.id} className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group bg-white">
                   
                   {/* Time Indicator */}
                   <div className="sm:w-32 shrink-0 border-l-4 border-transparent sm:pl-4 pl-0 border-l-gray-200 sm:group-hover:border-l-primary transition-colors flex flex-col justify-center">
                     <span className="text-sm font-black text-gray-900">{apt.time.split(' - ')[0]}</span>
                     <span className="text-xs font-bold text-gray-400">{apt.time.split(' - ')[1]}</span>
                   </div>

                   {/* Main Content */}
                   <div className={`flex-1 p-4 rounded-xl border-l-4 ${apt.color} ${apt.bg} flex flex-col sm:flex-row justify-between sm:items-center gap-4`}>
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-sm text-gray-600 border border-gray-100">
                           {apt.patient.split(' ').map(n => n[0]).join('')}
                         </div>
                         <div>
                           <h4 className={`text-base font-black ${apt.text} mb-0.5`}>{apt.patient}</h4>
                           <div className="flex items-center gap-3">
                             <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">{apt.type}</p>
                             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                             <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
                               {apt.format === 'Video Call' ? <Video className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                               {apt.format}
                             </p>
                           </div>
                         </div>
                      </div>

                      {/* Action Button */}
                      <button className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${
                        apt.status === 'Upcoming' 
                          ? 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300' 
                          : 'bg-primary text-white shadow-primary/20 hover:bg-primary/90'
                      }`}>
                         {apt.format === 'Video Call' ? <Video className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                         Join Session
                      </button>
                   </div>
                </div>
              ))}
            </div>

            <Link to="/doctor/appointments" className="mt-6 w-full py-3 bg-gray-50 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
              View Full Calendar <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* AI HEALTHCARE ASSISTANT & RECENT ACTIVITY        */}
        {/* ------------------------------------------------ */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300 fill-mode-both">
          
          <div className="bg-gradient-to-br from-[#0B1120] to-gray-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-gray-800">
            <div className="absolute -right-10 -top-10 text-indigo-500/20 pointer-events-none">
               <BrainCircuit className="w-48 h-48" />
            </div>

            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                   <Sparkles className="w-6 h-6" />
                 </div>
                 <h2 className="text-xl font-admin-heading font-black tracking-tight">AI Clinical Insights</h2>
               </div>

               <div className="space-y-4">
                  {/* Alert Card */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer">
                     <div className="flex items-start gap-3">
                       <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                       <div>
                         <h4 className="text-sm font-black text-gray-100 mb-1">Reassessment Suggested</h4>
                         <p className="text-xs font-medium text-gray-400 leading-relaxed mb-3">Rahul's progress has plateaued over the last 3 weeks in expressive language.</p>
                         <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider group-hover:text-indigo-300 transition-colors flex items-center gap-1">Review Data <ArrowRight className="w-3 h-3" /></span>
                       </div>
                     </div>
                  </div>

                  {/* Suggestion Card */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer">
                     <div className="flex items-start gap-3">
                       <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                       <div>
                         <h4 className="text-sm font-black text-gray-100 mb-1">Therapy Adjustment</h4>
                         <p className="text-xs font-medium text-gray-400 leading-relaxed mb-3">Consider introducing PECS for Aarav based on recent motor skill improvements.</p>
                         <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider group-hover:text-emerald-300 transition-colors flex items-center gap-1">Update Plan <ArrowRight className="w-3 h-3" /></span>
                       </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-admin-heading font-black text-gray-900 tracking-tight">Recent Activity</h2>
              <button className="text-primary text-sm font-bold hover:underline">View All</button>
            </div>

            <div className="space-y-6">
              {RECENT_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 z-10 relative text-gray-400">
                      {activity.type === 'video' ? <Video className="w-4 h-4" /> : activity.type === 'assessment' ? <ClipboardList className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                    </div>
                    {activity.id !== RECENT_ACTIVITY.length && (
                      <div className="absolute top-10 bottom-[-24px] left-1/2 -translate-x-1/2 w-px bg-gray-200"></div>
                    )}
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-bold text-gray-800 mb-0.5">{activity.action}</p>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                      <span className="text-primary">{activity.patient}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
