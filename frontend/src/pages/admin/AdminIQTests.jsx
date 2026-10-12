import { useState } from 'react';
import { Search, Brain, Clock, AlertCircle, CheckCircle2, Download, Settings, FileText, ChevronRight } from 'lucide-react';

const STATS = [
  { label: 'Total Tests Taken', value: '1,492', icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { label: 'Avg Score', value: '68', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { label: 'Tests This Week', value: '45', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  { label: 'Pending Review', value: '12', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
];

const TESTS = [
  { id: 'T-1029', child: 'Aarav Sharma', age: '4y', parent: 'Priya S.', date: 'Today 10:00 AM', score: '62', band: 'Moderate', duration: '18m', status: 'Auto-Scored' },
  { id: 'T-1028', child: 'Vikram Singh', age: '5y', parent: 'Tanya S.', date: 'Yesterday', score: '82', band: 'Mild', duration: '22m', status: 'Needs Review' },
  { id: 'T-1027', child: 'Riya Patel', age: '3y', parent: 'Neha P.', date: 'Oct 12', score: '45', band: 'Severe', duration: '15m', status: 'Reviewed' },
  { id: 'T-1026', child: 'Kabir Khan', age: '6y', parent: 'Zoya K.', date: 'Oct 10', score: '35', band: 'Profound', duration: '20m', status: 'Auto-Scored' },
  { id: 'T-1025', child: 'Ananya Gupta', age: '4y', parent: 'Rohan G.', date: 'Oct 09', score: '78', band: 'Mild', duration: '25m', status: 'Reviewed' },
];

const AdminIQTests = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight flex items-center gap-3">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
               <Brain className="w-6 h-6" />
             </div>
             IQ Test Management
          </h2>
          <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Review AI-scored assessments, analyze test results, and manage the question bank.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-4 py-2 bg-white text-text text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-primary transition-all flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4 text-gray-500" /> Export Data
          </button>
           <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/30 hover:bg-primary/90 hover:shadow-md transition-all flex items-center gap-2">
            <Settings className="w-4 h-4" /> Manage Question Bank
          </button>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
           <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center gap-5 hover:shadow-md transition-shadow group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-gray-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
             <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} ${stat.border} border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
               <stat.icon className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
               <h3 className="text-2xl font-mono font-black text-text tracking-tight">{stat.value}</h3>
             </div>
           </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
           <div className="relative flex-1 md:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input type="text" placeholder="Search by Test ID, child or parent..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 font-medium" />
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
             <div className="relative w-full md:w-auto">
               <select className="w-full md:w-48 bg-white border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors">
                <option>Filter Status: All</option>
                <option>Auto-Scored</option>
                <option>Needs Review</option>
                <option>Reviewed</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
              <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                <th className="px-6 py-4">Test Details</th>
                <th className="px-6 py-4">Child Patient</th>
                <th className="px-6 py-4">Date Taken</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4">IQ Band</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50 font-medium">
               {TESTS.map((test) => (
                 <tr key={test.id} className="hover:bg-gray-50/80 transition-colors group">
                   <td className="px-6 py-4 align-middle">
                     <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                         <FileText className="w-4 h-4 text-gray-500" />
                       </div>
                       <span className="font-mono font-bold text-gray-600 text-xs">{test.id}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4 align-middle">
                     <p className="font-bold text-text group-hover:text-primary transition-colors text-sm">{test.child} <span className="text-[11px] text-gray-500 font-mono font-bold ml-1 bg-gray-100 px-1.5 py-0.5 rounded-md">{test.age}</span></p>
                     <p className="text-xs text-gray-500 font-mono mt-0.5">Parent: {test.parent}</p>
                   </td>
                   <td className="px-6 py-4 align-middle">
                     <span className="text-xs font-mono font-semibold text-gray-600">{test.date}</span>
                   </td>
                   <td className="px-6 py-4 align-middle text-center">
                     <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-text font-mono font-black text-sm border border-gray-200">
                       {test.score}
                     </span>
                   </td>
                   <td className="px-6 py-4 align-middle">
                     <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                       test.band === 'Mild' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                       test.band === 'Moderate' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                       test.band === 'Severe' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                       'bg-red-50 text-red-700 border-red-200'
                     }`}>
                       {test.band}
                     </span>
                   </td>
                   <td className="px-6 py-4 align-middle">
                     <div className="flex items-center gap-1.5 text-gray-500 text-xs font-mono font-semibold">
                       <Clock className="w-3.5 h-3.5" /> {test.duration}
                     </div>
                   </td>
                   <td className="px-6 py-4 align-middle">
                     <div className="flex items-center gap-2">
                         <span className={`w-2.5 h-2.5 rounded-full shadow-sm border border-white ring-1 ${
                           test.status === 'Auto-Scored' ? 'bg-emerald-500 ring-emerald-200' : 
                           test.status === 'Needs Review' ? 'bg-amber-500 ring-amber-200 animate-pulse' : 
                           'bg-blue-500 ring-blue-200'
                         }`}></span>
                         <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{test.status}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4 text-right align-middle">
                     <button className="text-xs font-bold text-primary hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5 ml-auto opacity-0 group-hover:opacity-100 shadow-sm">
                       Review <ChevronRight className="w-3.5 h-3.5" />
                     </button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
           <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
             Showing <span className="text-text">1</span> to <span className="text-text">5</span> of <span className="text-text">1,492</span> tests
           </div>
           <div className="flex items-center gap-1">
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm">Prev</button>
             <button className="px-3 py-1.5 border border-primary rounded-lg bg-primary text-white text-xs font-bold shadow-sm shadow-primary/20">1</button>
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors">2</button>
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors">3</button>
             <span className="px-2 text-gray-400">...</span>
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm">Next</button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminIQTests;
