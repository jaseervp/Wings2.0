import { useState } from 'react';
import { Puzzle, Search, Plus, PlayCircle, Settings2, Copy, FileText, CheckCircle2, ArrowRight, Clock } from 'lucide-react';

const THERAPY_PLANS = [
  { id: 1, name: 'Core Speech Articulation', category: 'Speech Therapy', assigned: 14, duration: '12 Weeks', goals: 8, status: 'Active' },
  { id: 2, name: 'Fine Motor Skills Foundation', category: 'Occupational Therapy', assigned: 8, duration: '8 Weeks', goals: 5, status: 'Active' },
  { id: 3, name: 'Gluten-Free Diet Plan Basic', category: 'Dietitian', assigned: 22, duration: 'Ongoing', goals: 3, status: 'Active' },
  { id: 4, name: 'Emotional Regulation Series', category: 'Behavioral Therapy', assigned: 11, duration: '16 Weeks', goals: 12, status: 'Active' },
  { id: 5, name: 'Sensory Processing Program', category: 'Occupational Therapy', assigned: 5, duration: '12 Weeks', goals: 6, status: 'Draft' },
];

const DoctorTherapyPlans = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-gray-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
               <Puzzle className="w-6 h-6" />
             </div>
             Therapy Plan Builder
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Create, manage, and assign clinical therapy programs.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Copy className="w-4 h-4" /> Import Template
           </button>
           <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create New Plan
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Column: Plan Library */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
               
               <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
                  <div className="relative w-full sm:w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input type="text" placeholder="Search plans..." className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all" />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="px-3 py-1.5 bg-gray-800 text-white text-xs font-bold rounded-lg shadow-sm">All Plans</button>
                    <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg shadow-sm hover:bg-gray-50">My Templates</button>
                    <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg shadow-sm hover:bg-gray-50">Drafts</button>
                  </div>
               </div>

               <div className="divide-y divide-gray-100">
                  {THERAPY_PLANS.map((plan) => (
                    <div key={plan.id} className="p-5 hover:bg-gray-50/50 transition-colors group">
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                             <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                             </div>
                             <div>
                               <h4 className="text-sm font-black text-gray-800 group-hover:text-primary transition-colors">{plan.name}</h4>
                               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">{plan.category}</p>
                               <div className="flex items-center gap-3 mt-2 text-xs font-bold text-gray-500">
                                 <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {plan.goals} Goals</span>
                                 <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-500" /> {plan.duration}</span>
                               </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-4 sm:justify-end pl-14 sm:pl-0">
                             <div className="text-right hidden sm:block">
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Assigned</p>
                               <p className="text-sm font-black text-gray-800">{plan.assigned} <span className="text-xs font-bold text-gray-500">Patients</span></p>
                             </div>
                             <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                               <Settings2 className="w-5 h-5" />
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Column: Quick Preview */}
         <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
               <h3 className="text-base font-black text-gray-800 mb-4">Plan Preview</h3>
               
               <div className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm mb-6">
                  <div className="inline-flex px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider mb-3">
                    Active Plan
                  </div>
                  <h4 className="text-lg font-black text-gray-800 mb-1">Core Speech Articulation</h4>
                  <p className="text-xs font-bold text-gray-500 mb-4">Targets bilabial and alveolar sounds for children aged 3-5.</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                     <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duration</p>
                        <p className="text-sm font-black text-gray-800">12 Weeks</p>
                     </div>
                     <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Activities</p>
                        <p className="text-sm font-black text-gray-800">24 Items</p>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Key Milestones</p>
                     <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                       <p className="text-xs font-bold text-gray-600">Produce /p/, /b/, /m/ in isolation.</p>
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                       <p className="text-xs font-bold text-gray-600">Produce sounds in initial word positions.</p>
                     </div>
                  </div>
               </div>

               <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                 Edit Plan Details <ArrowRight className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DoctorTherapyPlans;
