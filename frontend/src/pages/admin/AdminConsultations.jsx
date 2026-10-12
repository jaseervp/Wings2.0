import { useState } from 'react';
import { Search, Calendar, List, Video, MapPin, MoreVertical, CalendarDays, Plus, Download, ChevronDown, CheckCircle2, XCircle, Clock } from 'lucide-react';

const CONSULTATIONS = [
  { id: 'C-7741', patient: 'Aarav Sharma', parent: 'Priya Sharma', therapist: 'Dr. Meera Nair', date: 'Oct 24, 10:00 AM', type: 'Video', status: 'Upcoming', fee: '₹800' },
  { id: 'C-7740', patient: 'Riya Patel', parent: 'Neha Patel', therapist: 'Dr. Sarah Thomas', date: 'Oct 23, 02:30 PM', type: 'In-person', status: 'Completed', fee: '₹1200' },
  { id: 'C-7739', patient: 'Vikram Singh', parent: 'Tanya Singh', therapist: 'Dr. Arun Kumar', date: 'Oct 23, 11:00 AM', type: 'Video', status: 'No-show', fee: '₹800' },
  { id: 'C-7738', patient: 'Kiran Desai', parent: 'Amit Desai', therapist: 'Dr. Meera Nair', date: 'Oct 22, 04:00 PM', type: 'Video', status: 'Cancelled', fee: 'Refunded' },
  { id: 'C-7737', patient: 'Ananya Gupta', parent: 'Rohan Gupta', therapist: 'Dr. Vikram Shah', date: 'Oct 25, 01:00 PM', type: 'In-person', status: 'Upcoming', fee: '₹1200' },
];

const AdminConsultations = () => {
  const [view, setView] = useState('list');
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight flex items-center gap-3">
             <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
               <CalendarDays className="w-6 h-6" />
             </div>
             Consultations
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Manage scheduled therapy sessions, clinical meetings, and appointments.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-4 py-2 bg-white text-text text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-primary transition-all flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4 text-gray-500" /> Export Schedule
          </button>
          <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/30 hover:bg-primary/90 hover:shadow-md transition-all flex items-center gap-2">
             <Plus className="w-4 h-4" /> Book Session
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-gray-50/50">
           
           {/* Modern Tabs */}
           <div className="flex items-center gap-1 bg-gray-100/80 border border-gray-200/60 p-1.5 rounded-xl shadow-inner w-full md:w-auto overflow-x-auto scrollbar-hide">
              {['All', 'Upcoming', 'Completed', 'Cancelled', 'No-show'].map(tab => (
                 <button 
                   key={tab} 
                   onClick={() => setActiveTab(tab)}
                   className={`px-4 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                     activeTab === tab ? 'bg-white text-primary shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-text hover:bg-gray-200/50'
                   }`}
                 >
                   {tab}
                 </button>
              ))}
           </div>
           
           <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
             <div className="relative flex-1 w-full md:w-72 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input type="text" placeholder="Search by patient, therapist, or ID..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 font-medium" />
              </div>
             
             <div className="flex items-center gap-1 bg-gray-100/80 border border-gray-200/60 p-1.5 rounded-xl shadow-inner shrink-0 w-full justify-center md:w-auto md:justify-start">
                <button onClick={() => setView('calendar')} className={`p-2 rounded-lg transition-all flex items-center justify-center ${view === 'calendar' ? 'bg-white text-primary shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-text hover:bg-gray-200/50'}`}>
                  <Calendar className="w-4 h-4" />
                </button>
                <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all flex items-center justify-center ${view === 'list' ? 'bg-white text-primary shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-text hover:bg-gray-200/50'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
           </div>
        </div>

        {view === 'list' ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                    <th className="px-6 py-4">Session ID</th>
                    <th className="px-6 py-4">Patient / Parent</th>
                    <th className="px-6 py-4">Therapist</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Consultation Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Fee / Billing</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50 font-medium">
                   {CONSULTATIONS.map((c) => (
                     <tr key={c.id} className="hover:bg-gray-50/80 transition-colors group">
                       <td className="px-6 py-4 align-middle">
                         <span className="font-mono font-bold text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded-md border border-gray-200">{c.id}</span>
                       </td>
                       <td className="px-6 py-4 align-middle">
                          <p className="font-bold text-text group-hover:text-primary transition-colors text-sm">{c.patient}</p>
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5 font-bold">Parent: {c.parent}</p>
                       </td>
                       <td className="px-6 py-4 font-bold text-text align-middle text-sm">{c.therapist}</td>
                       <td className="px-6 py-4 text-xs font-mono font-semibold text-gray-600 align-middle">{c.date}</td>
                       <td className="px-6 py-4 align-middle">
                         <span className={`flex w-max items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                           c.type === 'Video' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                         }`}>
                           {c.type === 'Video' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />} {c.type}
                         </span>
                       </td>
                       <td className="px-6 py-4 align-middle">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${
                            c.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            c.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            c.status === 'Cancelled' ? 'bg-gray-50 text-gray-600 border-gray-200' : 
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                           {c.status === 'Upcoming' && <Clock className="w-3 h-3" />}
                           {c.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                           {c.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                           {c.status === 'No-show' && <XCircle className="w-3 h-3" />}
                           {c.status}
                         </span>
                       </td>
                       <td className="px-6 py-4 font-mono font-bold text-gray-600 text-sm align-middle">{c.fee}</td>
                       <td className="px-6 py-4 text-right align-middle">
                         <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 border border-transparent hover:border-blue-100 shadow-sm">
                           <MoreVertical className="w-4 h-4" />
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
                 Showing <span className="text-text">1</span> to <span className="text-text">5</span> of <span className="text-text">38</span> sessions
               </div>
               <div className="flex items-center gap-1">
                 <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm">Prev</button>
                 <button className="px-3 py-1.5 border border-primary rounded-lg bg-primary text-white text-xs font-bold shadow-sm shadow-primary/20">1</button>
                 <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors">2</button>
                 <span className="px-2 text-gray-400">...</span>
                 <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm">Next</button>
               </div>
            </div>
          </>
        ) : (
          <div className="p-16 text-center border-t border-gray-100 min-h-[500px] flex flex-col items-center justify-center bg-gray-50/30">
            <div className="w-16 h-16 bg-white border border-gray-200 shadow-sm rounded-2xl flex items-center justify-center mb-4 text-gray-400">
              <Calendar className="w-8 h-8"/>
            </div>
            <h3 className="text-xl font-admin-heading font-black text-text mb-2">Calendar View Plugin Required</h3>
            <p className="text-gray-500 font-medium text-sm max-w-sm">Please integrate a scheduling plugin (like react-big-calendar or FullCalendar) to view consultations in a grid format.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminConsultations;
