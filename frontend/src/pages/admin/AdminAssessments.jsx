import { useState } from 'react';
import { Search, Filter, AlertTriangle, Eye, ArrowRight, Download, FileText, CheckCircle2, Clock } from 'lucide-react';

const ASSESSMENTS = [
  { id: 'A-2201', child: 'Aarav Sharma', parent: 'Priya Sharma', date: 'Today 09:15 AM', qs: 45, completion: 100, status: 'Needs Review', flagged: true },
  { id: 'A-2202', child: 'Riya Patel', parent: 'Neha Patel', date: 'Yesterday', qs: 45, completion: 100, status: 'Reviewed', flagged: false },
  { id: 'A-2203', child: 'Vikram Singh', parent: 'Tanya Singh', date: 'Oct 12, 2024', qs: 45, completion: 40, status: 'In Progress', flagged: false },
  { id: 'A-2204', child: 'Kiran Desai', parent: 'Amit Desai', date: 'Oct 10, 2024', qs: 45, completion: 100, status: 'Needs Review', flagged: true },
  { id: 'A-2205', child: 'Ananya Gupta', parent: 'Rohan Gupta', date: 'Oct 08, 2024', qs: 45, completion: 100, status: 'Reviewed', flagged: false },
];

const AdminAssessments = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight flex items-center gap-3">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
               <FileText className="w-6 h-6" />
             </div>
             Preliminary Assessments
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Review parent-submitted developmental questionnaires and triage cases.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white text-text text-sm font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4 text-gray-500" /> Export List
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
           <div className="relative flex-1 md:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input type="text" placeholder="Search by Assessment ID, child or parent..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 font-medium" />
          </div>
          <div className="flex flex-wrap gap-3">
             <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:text-text hover:bg-gray-50 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-sm">
               <Filter className="w-4 h-4" /> Filter Views
             </button>
             <button className="px-4 py-2 border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-sm">
               <AlertTriangle className="w-4 h-4" /> Flagged Only
             </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                <th className="px-6 py-4">Assessment ID</th>
                <th className="px-6 py-4">Child Patient</th>
                <th className="px-6 py-4">Submitted Date</th>
                <th className="px-6 py-4 text-center">Completion</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50 font-medium">
               {ASSESSMENTS.map((item) => (
                 <tr key={item.id} className={`transition-colors group ${item.flagged ? 'bg-amber-50/30 hover:bg-amber-50' : 'hover:bg-gray-50/80'}`}>
                   <td className="px-6 py-4 align-middle">
                     <div className="flex items-center gap-2.5">
                       {item.flagged ? (
                         <div className="p-1.5 bg-amber-100 text-amber-600 rounded-md">
                           <AlertTriangle className="w-3.5 h-3.5" />
                         </div>
                       ) : (
                         <div className="p-1.5 bg-gray-100 text-gray-400 rounded-md">
                           <FileText className="w-3.5 h-3.5" />
                         </div>
                       )}
                       <span className={`font-mono font-bold text-xs ${item.flagged ? 'text-amber-800' : 'text-gray-500'}`}>{item.id}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4 align-middle">
                      <p className="font-bold text-text group-hover:text-primary transition-colors text-sm">{item.child}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">Parent: {item.parent}</p>
                   </td>
                   <td className="px-6 py-4 align-middle">
                     <span className="font-mono text-gray-600 text-xs font-semibold">{item.date}</span>
                   </td>
                   <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-3 justify-center group-hover:scale-105 transition-transform">
                        <span className="font-mono text-xs font-bold text-gray-600 w-8 text-right">{item.completion}%</span>
                        <div className="w-24 h-2 bg-gray-100 border border-gray-200/50 rounded-full overflow-hidden shadow-inner">
                          <div className={`h-full ${item.completion === 100 ? 'bg-emerald-500' : 'bg-primary'} rounded-full`} style={{ width: `${item.completion}%` }}></div>
                        </div>
                      </div>
                   </td>
                   <td className="px-6 py-4 align-middle">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${
                       item.status === 'Reviewed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                       item.status === 'In Progress' ? 'bg-gray-50 text-gray-600 border-gray-200' : 
                       'bg-amber-50 text-amber-700 border-amber-200'
                     }`}>
                       {item.status === 'Reviewed' && <CheckCircle2 className="w-3 h-3" />}
                       {item.status === 'Needs Review' && <AlertTriangle className="w-3 h-3" />}
                       {item.status === 'In Progress' && <Clock className="w-3 h-3" />}
                       {item.status}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-right align-middle">
                     <button className="text-xs font-bold text-primary hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-100 flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100 shadow-sm">
                       Review <ArrowRight className="w-3.5 h-3.5" />
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
             Showing <span className="text-text">1</span> to <span className="text-text">5</span> of <span className="text-text">142</span> assessments
           </div>
           <div className="flex items-center gap-1">
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm">Prev</button>
             <button className="px-3 py-1.5 border border-primary rounded-lg bg-primary text-white text-xs font-bold shadow-sm shadow-primary/20">1</button>
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors">2</button>
             <span className="px-2 text-gray-400">...</span>
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm">Next</button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAssessments;
