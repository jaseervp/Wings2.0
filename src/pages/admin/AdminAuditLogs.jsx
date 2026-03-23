import { useState } from 'react';
import { Search, Download, Filter, ShieldCheck } from 'lucide-react';

const LOGS = [
  { id: 1, time: '2024-10-24 10:45:12', admin: 'System Auth', action: 'Login', entity: 'AdminUser', entityId: 'A-001', ip: '192.168.1.45', details: 'Successful session established' },
  { id: 2, name: 'anita', time: '2024-10-24 09:30:00', admin: 'Support Admin', action: 'Updated', entity: 'Assessment', entityId: 'A-2201', ip: '10.0.0.12', details: 'Flag cleared manually' },
  { id: 3, time: '2024-10-23 18:22:15', admin: 'Billing Admin', action: 'Deleted', entity: 'SubscriptionPlan', entityId: 'P-Basic', ip: '10.0.0.5', details: 'Legacy basic plan removed' },
  { id: 4, time: '2024-10-23 14:10:05', admin: 'Medical Reviewer', action: 'Created', entity: 'IQTestResult', entityId: 'T-1029', ip: '10.0.0.8', details: 'Manual override applied to Score' },
];

const AdminAuditLogs = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">Audit Logs</h2>
           <p className="text-muted font-medium text-sm mt-1">Review system activities, access history, and entity modifications.</p>
        </div>
      </div>

      <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border flex flex-col">
        <div className="p-4 border-b border-admin-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
           
           <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search by Entity ID..." className="w-full pl-9 pr-4 py-1.5 bg-white border border-admin-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
           </div>
           
           <div className="flex items-center gap-3 w-full md:w-auto">
             <select className="bg-white border border-admin-border text-xs rounded-lg px-3 py-2 outline-none font-bold text-muted w-full md:w-auto">
                <option>All Actions</option>
                <option>Created</option>
                <option>Updated</option>
                <option>Deleted</option>
                <option>Login</option>
              </select>
             <button className="px-3 py-1.5 border border-admin-border bg-white text-muted hover:text-text rounded-lg flex items-center gap-2 text-sm transition-colors font-bold whitespace-nowrap">
               <Download className="w-4 h-4" /> Export CSV
             </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-admin-border text-[11px] uppercase tracking-wider text-muted font-bold font-mono">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Admin User</th>
                <th className="px-6 py-4 flex items-center gap-1"><Filter className="w-3 h-3"/> Action</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">Entity ID</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-admin-border font-medium">
               {LOGS.map((log) => (
                 <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                   <td className="px-6 py-4 font-mono text-muted text-xs whitespace-nowrap">{log.time}</td>
                   <td className="px-6 py-4 font-bold text-text flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-accent" /> {log.admin}
                   </td>
                   <td className="px-6 py-4">
                     <span className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                       log.action === 'Created' ? 'bg-success/10 text-success' : 
                       log.action === 'Updated' ? 'bg-primary/10 text-primary' : 
                       log.action === 'Deleted' ? 'bg-admin-danger/10 text-admin-danger' : 
                       'bg-gray-200 text-muted'
                     }`}>
                       {log.action}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-muted text-xs">{log.entity}</td>
                   <td className="px-6 py-4 font-mono font-bold text-text text-xs">{log.entityId}</td>
                   <td className="px-6 py-4 font-mono text-muted text-xs">{log.ip}</td>
                   <td className="px-6 py-4 text-xs text-muted max-w-[200px] truncate">{log.details}</td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
