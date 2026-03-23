import { useState } from 'react';
import { Search, Plus, Star, Calendar, Users, Edit2, Video } from 'lucide-react';

const THERAPISTS = [
  { id: 1, name: 'Dr. Meera Nair', spec: 'Speech Therapist', rating: 4.8, reviews: 124, activePts: 32, status: 'Active', bg: 'bg-primary' },
  { id: 2, name: 'Dr. Arun Kumar', spec: 'Occupational Therapist', rating: 4.9, reviews: 89, activePts: 28, status: 'Active', bg: 'bg-accent' },
  { id: 3, name: 'Dr. Sarah Thomas', spec: 'Child Psychologist', rating: 4.7, reviews: 156, activePts: 45, status: 'Active', bg: 'bg-admin-warning' },
  { id: 4, name: 'Dr. Rohan Patel', spec: 'Behavioral Therapist', rating: 4.5, reviews: 42, activePts: 15, status: 'Inactive', bg: 'bg-gray-400' },
];

const AdminTherapists = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">Therapists Management</h2>
           <p className="text-muted font-medium text-sm mt-1">Manage clinical staff, availabilities, and patient assignments.</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2">
           <Plus className="w-4 h-4" /> Add Therapist
        </button>
      </div>

      <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
         <div className="relative flex-1 md:max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search therapists..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-admin-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
          </div>
          <select className="bg-white border border-admin-border text-sm rounded-lg px-3 py-2 outline-none font-bold text-muted w-full md:w-auto">
            <option>All Specializations</option>
            <option>Speech Therapy</option>
            <option>Occupational Therapy</option>
            <option>Psychology</option>
          </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {THERAPISTS.map((doc) => (
           <div key={doc.id} className="bg-admin-surface rounded-xl shadow-sm border border-admin-border overflow-hidden hover:border-primary/30 transition-colors flex flex-col">
              <div className="p-6 flex gap-4 border-b border-gray-50">
                <div className={`w-16 h-16 rounded-2xl ${doc.bg} text-white font-bold flex items-center justify-center text-2xl shrink-0 shadow-inner`}>
                  {doc.name.charAt(4)}
                </div>
                <div>
                  <h3 className="font-admin-heading font-bold text-text truncate pr-2">{doc.name}</h3>
                  <p className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block mt-1 mb-2">{doc.spec}</p>
                  <div className="flex items-center gap-1 text-xs font-bold text-muted">
                    <Star className="w-3.5 h-3.5 text-admin-warning fill-admin-warning" /> 
                    <span className="text-text">{doc.rating}</span> 
                    <span className="font-normal font-mono">({doc.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 space-y-3 bg-gray-50/50">
                 <div className="flex items-center gap-3 text-sm text-text font-medium">
                   <Calendar className="w-4 h-4 text-muted" /> Available: Mon - Fri
                 </div>
                 <div className="flex items-center gap-3 text-sm text-text font-medium">
                   <Users className="w-4 h-4 text-muted" /> {doc.activePts} active patients
                 </div>
                 <div className="flex items-center gap-3 text-sm text-text font-medium">
                   <span className={`w-2 h-2 rounded-full ${doc.status === 'Active' ? 'bg-success' : 'bg-gray-400'}`}></span>
                   Status: {doc.status}
                 </div>
              </div>
              <div className="p-4 bg-white border-t border-admin-border flex gap-2">
                 <button className="flex-1 py-2 text-sm font-bold text-muted hover:text-text border border-admin-border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                   <Edit2 className="w-4 h-4" /> Edit
                 </button>
                 <button className="flex-1 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm">
                   <Video className="w-4 h-4" /> Schedule
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default AdminTherapists;
