import { useState } from 'react';
import { Search, Brain, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const STATS = [
  { label: 'Total Tests Taken', value: '1,492', icon: Brain, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Avg Score', value: '68', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  { label: 'Tests This Week', value: '45', icon: Clock, color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'Pending Review', value: '12', icon: AlertCircle, color: 'text-admin-warning', bg: 'bg-admin-warning/10' },
];

const TESTS = [
  { id: 'T-1029', child: 'Aarav Sharma', age: '4y', parent: 'Priya S.', date: 'Today 10:00 AM', score: '62', band: 'Moderate', duration: '18m', status: 'Auto-Scored' },
  { id: 'T-1028', child: 'Vikram Singh', age: '5y', parent: 'Tanya S.', date: 'Yesterday', score: '82', band: 'Mild', duration: '22m', status: 'Needs Review' },
  { id: 'T-1027', child: 'Riya Patel', age: '3y', parent: 'Neha P.', date: 'Oct 12', score: '45', band: 'Severe', duration: '15m', status: 'Reviewed' },
];

const AdminIQTests = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">IQ Test Management</h2>
          <p className="text-muted font-medium text-sm mt-1">Review AI-scored tests and manage the question bank.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 border border-admin-border bg-white text-text text-sm font-bold rounded-lg shadow-sm hover:bg-gray-50 transition-all">
            Question Bank
          </button>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
           <div key={i} className="bg-admin-surface rounded-xl p-5 shadow-sm border border-admin-border flex items-center gap-4">
             <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
               <stat.icon className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs text-muted font-bold uppercase tracking-wide">{stat.label}</p>
               <h3 className="text-2xl font-mono font-black text-text mt-0.5">{stat.value}</h3>
             </div>
           </div>
        ))}
      </div>

      <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border flex flex-col">
        <div className="p-4 border-b border-admin-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by child ID or name..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-admin-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 xl:w-80 outline-none" />
          </div>
          <div className="flex gap-2">
             <select className="bg-white border border-admin-border text-sm rounded-lg px-3 py-2 outline-none font-bold text-muted">
              <option>Status: All</option>
              <option>Auto-Scored</option>
              <option>Needs Review</option>
              <option>Reviewed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
              <tr className="bg-gray-50/50 border-b border-admin-border text-[11px] uppercase tracking-wider text-muted font-bold font-mono">
                <th className="px-6 py-4">Test ID</th>
                <th className="px-6 py-4">Child (Age)</th>
                <th className="px-6 py-4">Parent</th>
                <th className="px-6 py-4">Date Taken</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4">IQ Band</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-admin-border font-medium">
               {TESTS.map((test) => (
                 <tr key={test.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer hover:shadow-sm">
                   <td className="px-6 py-4 font-mono font-bold text-muted text-xs">{test.id}</td>
                   <td className="px-6 py-4 font-bold text-text group-hover:text-primary transition-colors">{test.child} <span className="text-xs text-muted font-normal ml-1">({test.age})</span></td>
                   <td className="px-6 py-4 text-muted">{test.parent}</td>
                   <td className="px-6 py-4 text-xs font-mono">{test.date}</td>
                   <td className="px-6 py-4 font-mono font-black text-center text-text">{test.score}</td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold ${test.band === 'Mild' ? 'bg-accent/10 text-accent' : test.band === 'Moderate' ? 'bg-primary/10 text-primary' : 'bg-admin-danger/10 text-admin-danger'}`}>
                       {test.band}
                     </span>
                   </td>
                   <td className="px-6 py-4 font-mono text-muted text-xs">{test.duration}</td>
                   <td className="px-6 py-4 flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${test.status === 'Auto-Scored' ? 'bg-success' : test.status === 'Needs Review' ? 'bg-admin-warning animate-pulse' : 'bg-primary'}`}></span>
                       <span className="text-xs font-bold text-text">{test.status}</span>
                   </td>
                   <td className="px-6 py-4 text-right">
                     <button className="text-xs font-bold text-primary hover:underline">Review</button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminIQTests;
