import { useState } from 'react';
import { Search, Filter, AlertTriangle, Eye, ArrowRight } from 'lucide-react';

const ASSESSMENTS = [
  { id: 'A-2201', child: 'Aarav Sharma', parent: 'Priya Sharma', date: 'Today 09:15 AM', qs: 45, completion: 100, status: 'Needs Review', flagged: true },
  { id: 'A-2202', child: 'Riya Patel', parent: 'Neha Patel', date: 'Yesterday', qs: 45, completion: 100, status: 'Reviewed', flagged: false },
  { id: 'A-2203', child: 'Vikram Singh', parent: 'Tanya Singh', date: 'Oct 12, 2024', qs: 45, completion: 40, status: 'In Progress', flagged: false },
  { id: 'A-2204', child: 'Kiran Desai', parent: 'Amit Desai', date: 'Oct 10, 2024', qs: 45, completion: 100, status: 'Needs Review', flagged: true },
];

const AdminAssessments = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">Preliminary Assessments</h2>
           <p className="text-muted font-medium text-sm mt-1">Review parent-submitted developmental questionnaires.</p>
        </div>
      </div>

      <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border flex flex-col">
        <div className="p-4 border-b border-admin-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search assessments..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-admin-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
          </div>
          <div className="flex gap-2">
             <button className="px-3 py-2 border border-admin-border bg-white text-muted hover:text-text rounded-lg flex items-center gap-2 text-sm transition-colors">
               <Filter className="w-4 h-4" /> Filter
             </button>
             <button className="px-3 py-2 border border-admin-warning bg-admin-warning/10 text-admin-warning font-bold rounded-lg flex items-center gap-2 text-sm transition-colors hover:bg-admin-warning/20">
               <AlertTriangle className="w-4 h-4" /> Flagged Only
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-admin-border text-[11px] uppercase tracking-wider text-muted font-bold font-mono">
                <th className="px-6 py-4">Assessment ID</th>
                <th className="px-6 py-4">Child Patient</th>
                <th className="px-6 py-4">Submitted Date</th>
                <th className="px-6 py-4 text-center">Completion</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-admin-border font-medium">
               {ASSESSMENTS.map((item) => (
                 <tr key={item.id} className={`hover:bg-gray-50/50 transition-colors group cursor-pointer ${item.flagged ? 'bg-admin-warning/5 hover:bg-admin-warning/10' : ''}`}>
                   <td className="px-6 py-4 font-mono font-bold text-muted text-xs">
                     <div className="flex items-center gap-2">
                       {item.flagged && <AlertTriangle className="w-4 h-4 text-admin-warning" />}
                       {item.id}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                      <p className="font-bold text-text group-hover:text-primary transition-colors">{item.child}</p>
                      <p className="text-xs text-muted font-mono">{item.parent}</p>
                   </td>
                   <td className="px-6 py-4 font-mono text-muted text-xs">{item.date}</td>
                   <td className="px-6 py-4">
                      <div className="flex items-center gap-3 justify-center">
                        <span className="font-mono text-xs font-bold text-muted w-8">{item.completion}%</span>
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.completion === 100 ? 'bg-success' : 'bg-primary'} rounded-full`} style={{ width: `${item.completion}%` }}></div>
                        </div>
                      </div>
                   </td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${item.status === 'Reviewed' ? 'bg-success/10 text-success' : item.status === 'In Progress' ? 'bg-gray-100 text-muted' : 'bg-admin-warning/10 text-admin-warning'}`}>
                       {item.status}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-right">
                     <button className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors">
                       <ArrowRight className="w-4 h-4" />
                     </button>
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

export default AdminAssessments;
