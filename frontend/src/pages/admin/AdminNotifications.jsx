import { useState } from 'react';
import { Send, Clock, Users, Smartphone, Mail, Globe, BellRing, Bell } from 'lucide-react';

const HISTORY = [
  { id: 1, title: 'New Exercise Videos Added!', audience: 'All Users', channels: ['Push', 'In-App'], date: 'Today, 10:30 AM', status: 'Sent' },
  { id: 2, title: 'Complete Your Child\'s Assessment', audience: 'Pending Assessments', channels: ['Email', 'In-App'], date: 'Yesterday, 04:15 PM', status: 'Sent' },
  { id: 3, title: 'Upcoming App Maintenance', audience: 'All Users', channels: ['In-App'], date: 'Oct 12, 2024', status: 'Sent' },
];

const AdminNotifications = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight flex items-center gap-3">
             <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
               <BellRing className="w-6 h-6" />
             </div>
             Push & Notifications
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Broadcast announcements to users across Push, In-App, and Email channels.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 xl:gap-8 items-start">
        
        {/* Send Notification Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-orange-400"></div>
          
          <div className="p-6 md:p-8 border-b border-gray-100">
             <h3 className="text-xl font-admin-heading font-black text-text">Compose Message</h3>
             <p className="text-sm text-gray-500 font-medium mt-1">Draft a new announcement to send immediately or schedule for later.</p>
          </div>
          
          <div className="p-6 md:p-8 space-y-6 flex-1 bg-gray-50/30">
             <div>
               <label className="block text-sm font-bold text-text mb-2">Target Audience</label>
               <div className="relative">
                 <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold text-gray-700 shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors">
                   <option>All Users (1,245)</option>
                   <option>Free Plan Users (482)</option>
                   <option>Premium Subscribers (763)</option>
                   <option>Parents with Pending Assessments (124)</option>
                 </select>
                 <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
               </div>
             </div>
             
             <div>
               <label className="block text-sm font-bold text-text mb-3">Delivery Channels</label>
               <div className="grid grid-cols-3 gap-3">
                  <label className="flex flex-col items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-blue-50/30 transition-all shadow-sm group relative overflow-hidden">
                    <input type="checkbox" defaultChecked className="peer absolute opacity-0" />
                    <div className="absolute inset-0 border-2 border-transparent peer-checked:border-primary rounded-xl transition-all"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 rounded-full border border-gray-300 peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                       <CheckIcon className="w-2 h-2 text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                    <Smartphone className="w-6 h-6 text-gray-400 peer-checked:text-primary transition-colors" />
                    <span className="text-xs font-bold text-gray-500 peer-checked:text-primary transition-colors">Push</span>
                  </label>

                  <label className="flex flex-col items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-blue-50/30 transition-all shadow-sm group relative overflow-hidden">
                    <input type="checkbox" defaultChecked className="peer absolute opacity-0" />
                    <div className="absolute inset-0 border-2 border-transparent peer-checked:border-primary rounded-xl transition-all"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 rounded-full border border-gray-300 peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                       <CheckIcon className="w-2 h-2 text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                    <Bell className="w-6 h-6 text-gray-400 peer-checked:text-primary transition-colors" />
                    <span className="text-xs font-bold text-gray-500 peer-checked:text-primary transition-colors">In-App</span>
                  </label>

                  <label className="flex flex-col items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-blue-50/30 transition-all shadow-sm group relative overflow-hidden">
                    <input type="checkbox" className="peer absolute opacity-0" />
                    <div className="absolute inset-0 border-2 border-transparent peer-checked:border-primary rounded-xl transition-all"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 rounded-full border border-gray-300 peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                       <CheckIcon className="w-2 h-2 text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                    <Mail className="w-6 h-6 text-gray-400 peer-checked:text-primary transition-colors" />
                    <span className="text-xs font-bold text-gray-500 peer-checked:text-primary transition-colors">Email</span>
                  </label>
               </div>
             </div>
             
             <div>
               <label className="block text-sm font-bold text-text mb-2">Message Title</label>
               <input type="text" placeholder="e.g., New Therapy Videos Added!" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" />
             </div>
             
             <div>
               <label className="block text-sm font-bold text-text mb-2">Message Body</label>
               <textarea rows="4" placeholder="Type your message here..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm resize-none"></textarea>
               <div className="flex justify-between items-center mt-2">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Supports Emojis 🚀</span>
                 <span className="text-xs font-bold text-gray-400">0 / 250</span>
               </div>
             </div>
          </div>
          
          <div className="p-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-4">
             <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-blue-200 hover:text-primary flex items-center justify-center gap-2 transition-all shadow-sm">
               <Clock className="w-4 h-4" /> Schedule Later
             </button>
             <button className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-sm shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 transition-all">
               <Send className="w-4 h-4" /> Broadcast Now
             </button>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
             <div>
               <h3 className="text-xl font-admin-heading font-black text-text">Broadcast History</h3>
               <p className="text-sm text-gray-500 font-medium mt-1">Recent announcements sent to users.</p>
             </div>
          </div>
          
          <div className="flex-1 p-0 flex flex-col divide-y divide-gray-50">
             {HISTORY.map((item) => (
               <div key={item.id} className="p-5 hover:bg-gray-50/80 transition-colors group cursor-pointer">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-text group-hover:text-primary transition-colors text-sm">{item.title}</h4>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">{item.status}</span>
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-3 mt-3">
                   <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                     <Users className="w-3.5 h-3.5 text-gray-400" /> {item.audience}
                   </div>
                   <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                     <Globe className="w-3.5 h-3.5 text-gray-400" /> 
                     {item.channels.join(', ')}
                   </div>
                 </div>
                 
                 <div className="mt-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                   Sent {item.date}
                 </div>
               </div>
             ))}
             
             <button className="p-4 text-sm font-bold text-primary hover:bg-blue-50/50 transition-colors text-center w-full mt-auto border-t border-gray-100">
               View All History
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function CheckIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default AdminNotifications;
