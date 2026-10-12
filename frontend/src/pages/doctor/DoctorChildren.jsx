import { useState } from 'react';
import { Search, Filter, ArrowUpRight, Baby, Activity, FileText, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

const CHILDREN = [
  { id: 1, name: 'Aarav Patel', age: '4 yrs 2 mos', diagnosis: 'Autism Spectrum Disorder', level: 'Level 2', score: 68, progress: 12, nextAppt: 'Today, 10:00 AM', therapies: ['Speech', 'Occupational'], avatar: 'A' },
  { id: 2, name: 'Riya Sharma', age: '3 yrs 8 mos', diagnosis: 'Speech Delay', level: 'Level 1', score: 82, progress: 24, nextAppt: 'Tomorrow, 2:00 PM', therapies: ['Speech'], avatar: 'R' },
  { id: 3, name: 'Kabir Singh', age: '5 yrs 1 mo', diagnosis: 'ADHD', level: 'Level 2', score: 74, progress: 8, nextAppt: 'Oct 28, 11:30 AM', therapies: ['Behavioral', 'Diet'], avatar: 'K' },
  { id: 4, name: 'Ananya Gupta', age: '2 yrs 11 mos', diagnosis: 'Global Development Delay', level: 'Level 3', score: 45, progress: 18, nextAppt: 'Oct 29, 09:00 AM', therapies: ['Speech', 'Occupational', 'Diet'], avatar: 'An' },
  { id: 5, name: 'Vihaan Reddy', age: '4 yrs 5 mos', diagnosis: 'Autism Spectrum Disorder', level: 'Level 1', score: 88, progress: 32, nextAppt: 'Nov 02, 04:15 PM', therapies: ['Occupational'], avatar: 'V' },
  { id: 6, name: 'Diya Verma', age: '6 yrs 0 mos', diagnosis: 'Dyslexia', level: 'Level 1', score: 79, progress: 15, nextAppt: 'Nov 05, 10:00 AM', therapies: ['Special Ed'], avatar: 'D' },
];

const DoctorChildren = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-gray-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-blue-50 text-primary rounded-lg">
               <Baby className="w-6 h-6" />
             </div>
             Assigned Children
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Monitor and manage your active patient roster.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/30">
           
           <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
             <div className="relative flex-1 md:w-72 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input type="text" placeholder="Search patients by name or ID..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-gray-800 placeholder:text-gray-400 font-medium" />
              </div>
           </div>
           
           <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative w-full md:w-auto">
               <select className="w-full bg-white border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors">
                  <option>All Diagnoses</option>
                  <option>Autism Spectrum</option>
                  <option>ADHD</option>
                  <option>Speech Delay</option>
                  <option>Global Dev Delay</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Filter className="w-4 h-4" />
                </div>
             </div>
             
             <div className="relative w-full md:w-auto">
               <select className="w-full bg-white border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors">
                  <option>Sort by: Next Appt</option>
                  <option>Sort by: Name (A-Z)</option>
                  <option>Sort by: Progress</option>
                  <option>Sort by: Needs Review</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Filter className="w-4 h-4" />
                </div>
             </div>
           </div>
        </div>

        {/* Patient Grid */}
        <div className="p-6 bg-gray-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHILDREN.map((child) => (
               <div key={child.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-5 flex flex-col group relative overflow-hidden">
                 
                 <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-primary font-black text-xl shrink-0 shadow-sm border border-white">
                      {child.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                       <Link to={`/doctor/children/${child.id}`} className="text-base font-black text-gray-800 hover:text-primary transition-colors truncate block">{child.name}</Link>
                       <p className="text-xs font-bold text-gray-500 mt-0.5 truncate">{child.age} • {child.level}</p>
                       <p className="text-[11px] font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded-md mt-1.5 truncate max-w-full">{child.diagnosis}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3 mb-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Latest Score</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-gray-800">{child.score}</span>
                        <span className="text-[10px] font-bold text-emerald-600">+{child.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Next Appt</p>
                      <p className="text-xs font-bold text-gray-700 truncate">{child.nextAppt}</p>
                    </div>
                 </div>

                 <div className="mb-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Active Therapies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {child.therapies.map(t => (
                        <span key={t} className="text-[10px] font-bold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-lg shadow-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                 </div>

                 <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                   <Link to={`/doctor/children/${child.id}`} className="py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 hover:text-primary transition-all text-center flex items-center justify-center gap-1.5 shadow-sm">
                     <FileText className="w-3.5 h-3.5" /> Profile
                   </Link>
                   <button className="py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-all text-center shadow-sm shadow-primary/20 flex items-center justify-center gap-1.5">
                     <ClipboardList className="w-3.5 h-3.5" /> Plan
                   </button>
                 </div>

               </div>
            ))}
          </div>
        </div>
        
        {/* Pagination */}
        <div className="p-5 border-t border-gray-100 flex justify-between items-center bg-white">
           <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
             Showing <span className="text-gray-800">6</span> of <span className="text-gray-800">42</span> patients
           </div>
           <div className="flex items-center gap-1">
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm">Prev</button>
             <button className="px-3 py-1.5 border border-primary rounded-lg bg-primary text-white text-xs font-bold shadow-sm shadow-primary/20">1</button>
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">2</button>
             <span className="px-2 text-gray-400">...</span>
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorChildren;
