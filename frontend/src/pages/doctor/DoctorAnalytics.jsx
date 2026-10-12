import { useState } from 'react';
import { LineChart as RechartsLineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { LineChart, Download, Activity, Target, TrendingUp, Users } from 'lucide-react';

const PROGRESS_DATA = [
  { month: 'Jan', speech: 45, motor: 50, behavior: 40 },
  { month: 'Feb', speech: 48, motor: 55, behavior: 42 },
  { month: 'Mar', speech: 52, motor: 60, behavior: 45 },
  { month: 'Apr', speech: 58, motor: 65, behavior: 48 },
  { month: 'May', speech: 65, motor: 70, behavior: 55 },
  { month: 'Jun', speech: 72, motor: 75, behavior: 62 },
];

const RADAR_DATA = [
  { subject: 'Articulation', A: 80, B: 50, fullMark: 100 },
  { subject: 'Receptive', A: 90, B: 60, fullMark: 100 },
  { subject: 'Expressive', A: 65, B: 40, fullMark: 100 },
  { subject: 'Pragmatics', A: 70, B: 55, fullMark: 100 },
  { subject: 'Fluency', A: 85, B: 65, fullMark: 100 },
  { subject: 'Voice', A: 95, B: 70, fullMark: 100 },
];

const DoctorAnalytics = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-gray-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
               <LineChart className="w-6 h-6" />
             </div>
             Progress Analytics
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Monitor cohort performance and clinical outcomes.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Data
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center"><Users className="w-5 h-5" /></div>
               <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+12% YoY</span>
            </div>
            <div>
               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Active Caseload</p>
               <h3 className="text-3xl font-black text-gray-800">42</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Target className="w-5 h-5" /></div>
               <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+5% MoM</span>
            </div>
            <div>
               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Goal Completion Rate</p>
               <h3 className="text-3xl font-black text-gray-800">78%</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
               <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">-2% MoM</span>
            </div>
            <div>
               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Avg Assessment Score</p>
               <h3 className="text-3xl font-black text-gray-800">71.4</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Activity className="w-5 h-5" /></div>
               <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+8% MoM</span>
            </div>
            <div>
               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Parent Engagement</p>
               <h3 className="text-3xl font-black text-gray-800">92%</h3>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Line Chart */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-base font-black text-gray-800 mb-6">Cohort Progress Trends (6 Months)</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={PROGRESS_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="speech" name="Speech" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="motor" name="Motor Skills" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="behavior" name="Behavioral" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </RechartsLineChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Radar Chart */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-base font-black text-gray-800 mb-6">Speech Domain Breakdown (Current vs Baseline)</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Current Avg" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                    <Radar name="Baseline Avg" dataKey="B" stroke="#94a3b8" fill="#cbd5e1" fillOpacity={0.3} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                  </RadarChart>
               </ResponsiveContainer>
            </div>
         </div>

      </div>
    </div>
  );
};

export default DoctorAnalytics;
