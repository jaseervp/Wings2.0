import { useState } from 'react';
import { Send, Clock, Users, Smartphone, Mail, Globe } from 'lucide-react';

const AdminNotifications = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">Notifications</h2>
           <p className="text-muted font-medium text-sm mt-1">Broadcast messages to users across Push, In-App, and Email.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Send Notification Panel */}
        <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border flex flex-col">
          <div className="p-5 border-b border-admin-border">
             <h3 className="font-admin-heading font-bold text-text">Compose Message</h3>
          </div>
          <div className="p-6 space-y-5 flex-1">
             <div>
               <label className="block text-sm font-bold text-text mb-1.5">Target Audience</label>
               <select className="w-full bg-white border border-admin-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium">
                 <option>All Users</option>
                 <option>Free Plan Users</option>
                 <option>Parents with Pending Assessments</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-bold text-text mb-1.5">Channel</label>
               <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" /> <Smartphone className="w-4 h-4 text-muted" /> Push
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" /> <Globe className="w-4 h-4 text-muted" /> In-App
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /> <Mail className="w-4 h-4 text-muted" /> Email
                  </label>
               </div>
             </div>
             <div>
               <label className="block text-sm font-bold text-text mb-1.5">Message Title</label>
               <input type="text" placeholder="e.g., New Therapy Videos Added!" className="w-full bg-white border border-admin-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
             </div>
             <div>
               <label className="block text-sm font-bold text-text mb-1.5">Message Body</label>
               <textarea rows="4" placeholder="Type your message here..." className="w-full bg-white border border-admin-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"></textarea>
             </div>
          </div>
          <div className="p-5 border-t border-admin-border bg-gray-50 flex gap-3">
             <button className="flex-1 py-2.5 bg-white border border-admin-border text-text font-bold rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors">
               <Clock className="w-4 h-4" /> Schedule
             </button>
             <button className="flex-1 py-2.5 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary/90 flex items-center justify-center gap-2 transition-colors">
               <Send className="w-4 h-4" /> Send Now
             </button>
          </div>
        </div>

        {/* History Placeholder */}
        <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border flex flex-col">
          <div className="p-5 border-b border-admin-border flex justify-between items-center bg-gray-50/50">
             <h3 className="font-admin-heading font-bold text-text">Notification History</h3>
          </div>
          <div className="p-16 flex flex-col items-center justify-center text-center text-muted flex-1">
             <Clock className="w-12 h-12 text-gray-200 mb-4" />
             <p className="font-bold">No notifications sent yet.</p>
             <p className="text-sm mt-1">History will appear here once broadcasts are sent.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
