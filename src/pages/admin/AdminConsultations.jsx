import { useState } from 'react';
import { Search, Filter, Calendar, List, Video, MapPin, MoreVertical } from 'lucide-react';

const CONSULTATIONS = [
  { id: 'C-7741', patient: 'Aarav Sharma', parent: 'Priya Sharma', therapist: 'Dr. Meera Nair', date: 'Oct 24, 10:00 AM', type: 'Video', status: 'Upcoming', fee: '₹800' },
  { id: 'C-7740', patient: 'Riya Patel', parent: 'Neha Patel', therapist: 'Dr. Sarah Thomas', date: 'Oct 23, 02:30 PM', type: 'In-person', status: 'Completed', fee: '₹1200' },
  { id: 'C-7739', patient: 'Vikram Singh', parent: 'Tanya Singh', therapist: 'Dr. Arun Kumar', date: 'Oct 23, 11:00 AM', type: 'Video', status: 'No-show', fee: '₹800' },
  { id: 'C-7738', patient: 'Kiran Desai', parent: 'Amit Desai', therapist: 'Dr. Meera Nair', date: 'Oct 22, 04:00 PM', type: 'Video', status: 'Cancelled', fee: 'Refunded' },
];

const AdminConsultations = () => {
  const [view, setView] = useState('list');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">Consultations</h2>
           <p className="text-muted font-medium text-sm mt-1">Manage all scheduled therapy sessions and clinical meetings.</p>
        </div>
      </div>

      <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border flex flex-col">
        <div className="p-4 border-b border-admin-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           {/* Filters */}
           <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              {['All', 'Upcoming', 'Completed', 'Cancelled', 'No-show'].map(tab => (
                 <button key={tab} className={`px-4 py-1.5 text-sm font-bold rounded-md whitespace-nowrap transition-colors border ${tab === 'All' ? 'bg-primary/10 text-primary border-transparent' : 'bg-white text-muted border-admin-border hover:bg-gray-50'}`}>
                   {tab}
                 </button>
              ))}
           </div>
           
           <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-admin-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
             <div className="flex bg-gray-50 border border-admin-border rounded-lg p-1">
                <button onClick={() => setView('calendar')} className={`p-1.5 rounded-md transition-all ${view === 'calendar' ? 'bg-white text-text shadow-sm' : 'text-muted hover:text-text'}`}>
                  <Calendar className="w-4 h-4" />
                </button>
                <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white text-text shadow-sm' : 'text-muted hover:text-text'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
           </div>
        </div>

        {view === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-admin-border text-[11px] uppercase tracking-wider text-muted font-bold font-mono">
                  <th className="px-6 py-4">Session ID</th>
                  <th className="px-6 py-4">Patient / Parent</th>
                  <th className="px-6 py-4">Therapist</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Fee</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-admin-border font-medium">
                 {CONSULTATIONS.map((c) => (
                   <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                     <td className="px-6 py-4 font-mono font-bold text-muted text-xs">{c.id}</td>
                     <td className="px-6 py-4">
                        <p className="font-bold text-text group-hover:text-primary transition-colors">{c.patient}</p>
                        <p className="text-xs text-muted font-mono">{c.parent}</p>
                     </td>
                     <td className="px-6 py-4 font-bold text-text">{c.therapist}</td>
                     <td className="px-6 py-4 text-xs font-mono">{c.date}</td>
                     <td className="px-6 py-4">
                       <span className="flex items-center gap-1.5 text-xs font-bold text-muted bg-gray-100 px-2 py-1 rounded inline-flex">
                         {c.type === 'Video' ? <Video className="w-3.5 h-3.5 text-primary" /> : <MapPin className="w-3.5 h-3.5 text-accent" />} {c.type}
                       </span>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                          c.status === 'Upcoming' ? 'bg-primary/10 text-primary' : 
                          c.status === 'Completed' ? 'bg-success/10 text-success' : 
                          c.status === 'Cancelled' ? 'bg-gray-200 text-muted' : 
                          'bg-admin-danger/10 text-admin-danger'
                        }`}>
                         {c.status}
                       </span>
                     </td>
                     <td className="px-6 py-4 font-mono font-bold text-text">{c.fee}</td>
                     <td className="px-6 py-4 text-right">
                       <button className="p-1.5 text-muted hover:text-text hover:bg-gray-200 rounded transition-colors opacity-0 group-hover:opacity-100">
                         <MoreVertical className="w-4 h-4" />
                       </button>
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted border-t border-admin-border min-h-[400px] flex items-center justify-center">
            <p className="font-bold flex items-center gap-2 justify-center"><Calendar className="w-5 h-5"/> Calendar View Plugin Required</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminConsultations;
