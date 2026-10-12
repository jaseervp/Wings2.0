import { useState } from 'react';
import { Search, Download, Filter, ShieldCheck, Activity, Key, Database, RefreshCw, XCircle } from 'lucide-react';

const LOGS = [
  { id: 1, time: '2024-10-24 10:45:12', admin: 'System Auth', action: 'Login', entity: 'AdminUser', entityId: 'A-001', ip: '192.168.1.45', details: 'Successful session established' },
  { id: 2, name: 'anita', time: '2024-10-24 09:30:00', admin: 'Support Admin', action: 'Updated', entity: 'Assessment', entityId: 'A-2201', ip: '10.0.0.12', details: 'Flag cleared manually' },
  { id: 3, time: '2024-10-23 18:22:15', admin: 'Billing Admin', action: 'Deleted', entity: 'SubscriptionPlan', entityId: 'P-Basic', ip: '10.0.0.5', details: 'Legacy basic plan removed' },
  { id: 4, time: '2024-10-23 14:10:05', admin: 'Medical Reviewer', action: 'Created', entity: 'IQTestResult', entityId: 'T-1029', ip: '10.0.0.8', details: 'Manual override applied to Score' },
  { id: 5, time: '2024-10-23 10:05:00', admin: 'System Auth', action: 'Failed Login', entity: 'AdminUser', entityId: 'A-042', ip: '185.12.34.88', details: 'Invalid credentials attempted' },
];

const AdminAuditLogs = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight flex items-center gap-3">
             <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
               <ShieldCheck className="w-6 h-6" />
             </div>
             Security & Audit Logs
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Review system activities, access history, and entity modifications.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-4 py-2 bg-white text-text text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-primary transition-all flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4 text-gray-500" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/30">
           
           <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
             <div className="relative flex-1 md:w-72 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input type="text" placeholder="Search logs by Entity ID, Admin, or IP..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 font-medium" />
              </div>
           </div>
           
           <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative w-full md:w-auto">
               <select className="w-full bg-white border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors">
                  <option>All Actions</option>
                  <option>Created</option>
                  <option>Updated</option>
                  <option>Deleted</option>
                  <option>Login</option>
                  <option>Failed Login</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Filter className="w-4 h-4" />
                </div>
             </div>
             
             <div className="relative w-full md:w-auto hidden sm:block">
               <select className="w-full bg-white border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors">
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>All Time</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Filter className="w-4 h-4" />
                </div>
             </div>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Admin User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity Modified</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50 font-medium">
               {LOGS.map((log) => (
                 <tr key={log.id} className="hover:bg-gray-50/80 transition-colors group">
                   <td className="px-6 py-4 font-mono font-bold text-gray-500 text-[11px] whitespace-nowrap align-middle">{log.time}</td>
                   <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-primary transition-all">
                           {log.admin === 'System Auth' ? <Key className="w-4 h-4 text-gray-500 group-hover:text-primary" /> : <ShieldCheck className="w-4 h-4 text-gray-500 group-hover:text-primary" />}
                         </div>
                         <p className="font-bold text-text group-hover:text-primary transition-colors text-sm">{log.admin}</p>
                      </div>
                   </td>
                   <td className="px-6 py-4 align-middle">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${
                       log.action === 'Created' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                       log.action === 'Updated' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                       log.action === 'Deleted' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                       log.action === 'Login' ? 'bg-gray-100 text-gray-700 border-gray-300' : 
                       'bg-amber-50 text-amber-700 border-amber-200'
                     }`}>
                       {log.action === 'Created' && <Activity className="w-3 h-3" />}
                       {log.action === 'Updated' && <RefreshCw className="w-3 h-3" />}
                       {log.action === 'Deleted' && <XCircle className="w-3 h-3" />}
                       {log.action === 'Failed Login' && <XCircle className="w-3 h-3" />}
                       {log.action}
                     </span>
                   </td>
                   <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col">
                         <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><Database className="w-3 h-3 text-gray-400" /> {log.entity}</span>
                         <span className="text-[11px] font-mono font-bold text-gray-500 mt-1">{log.entityId}</span>
                      </div>
                   </td>
                   <td className="px-6 py-4 font-mono font-bold text-gray-500 text-xs align-middle">{log.ip}</td>
                   <td className="px-6 py-4 text-xs text-gray-600 font-medium max-w-xs align-middle">
                      <p className="truncate" title={log.details}>{log.details}</p>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
           <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
             Showing <span className="text-text">1</span> to <span className="text-text">5</span> of <span className="text-text">2,842</span> events
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

export default AdminAuditLogs;
