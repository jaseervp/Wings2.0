import { useState } from 'react';
import { Search, Filter, Download, Plus, MoreVertical, Eye, Edit2, Trash2 } from 'lucide-react';

const USERS = [
  { id: 1, name: 'Anita Kumar', email: 'anita@email.com', children: 2, plan: 'Pro', status: 'Active', bg: 'bg-success', join: 'Jan 12, 2025' },
  { id: 2, name: 'Suresh Menon', email: 'suresh.m@email.com', children: 1, plan: 'Free', status: 'Active', bg: 'bg-success', join: 'Feb 03, 2025' },
  { id: 3, name: 'Priya Desai', email: 'priya.d@email.com', children: 3, plan: 'Premium', status: 'Inactive', bg: 'bg-muted', join: 'Nov 20, 2024' },
  { id: 4, name: 'Rahul Varma', email: 'r.varma@email.com', children: 2, plan: 'Pro', status: 'Banned', bg: 'bg-admin-danger', join: 'Mar 15, 2025' },
];

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('All Users');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">User Management</h2>
          <p className="text-muted font-medium text-sm mt-1">Manage parents, therapists, and administrative roles.</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border">
        {/* Toolbar */}
        <div className="p-4 border-b border-admin-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-1 bg-gray-50 border border-admin-border p-1 rounded-lg">
            {['All Users', 'Parents', 'Therapists', 'Admins'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === tab ? 'bg-white text-text shadow-sm' : 'text-muted hover:text-text'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search by name or email..." className="w-full pl-9 pr-4 py-2 bg-white border border-admin-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <button className="p-2 border border-admin-border rounded-lg text-muted hover:bg-gray-50 hover:text-text transition-colors">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 border border-admin-border rounded-lg text-muted hover:bg-gray-50 hover:text-text transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-admin-border text-[11px] uppercase tracking-wider text-muted font-bold font-mono">
                <th className="px-6 py-4 w-12 text-center"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /></th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Children</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-admin-border font-medium">
              {USERS.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer hover:shadow-sm">
                  <td className="px-6 py-4 w-12 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent text-white font-bold flex items-center justify-center shrink-0 shadow-inner">
                        {user.name.charAt(0)}
                      </div>
                      <p className="font-bold text-text group-hover:text-primary transition-colors">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted font-mono text-xs">{user.email}</td>
                  <td className="px-6 py-4 font-mono font-bold text-text text-center">{user.children}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold ${user.plan === 'Premium' ? 'bg-accent/10 text-accent' : user.plan === 'Pro' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-muted'}`}>
                       {user.plan}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${user.bg}`}></span>
                       <span className="text-xs font-bold text-text">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted text-xs font-bold">{user.join}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-muted hover:text-accent hover:bg-accent/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-1.5 text-muted hover:text-admin-danger hover:bg-admin-danger/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-admin-border flex justify-between items-center text-sm font-medium text-muted">
           <div>Showing 1 to 4 of 2,847 users</div>
           <div className="flex items-center gap-1">
             <button className="px-3 py-1 border border-admin-border rounded hover:bg-gray-50">Prev</button>
             <button className="px-3 py-1 border border-admin-border rounded bg-primary text-white border-primary shadow-sm hover:opacity-90">1</button>
             <button className="px-3 py-1 border border-admin-border rounded hover:bg-gray-50">2</button>
             <button className="px-3 py-1 border border-admin-border rounded hover:bg-gray-50">3</button>
             <button className="px-3 py-1 border border-admin-border rounded hover:bg-gray-50">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
