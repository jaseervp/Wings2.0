import { useState } from 'react';
import { ClipboardList, CheckCircle2, Clock, FileText, Search, Filter, AlertCircle, ArrowRight, BrainCircuit } from 'lucide-react';

const ASSESSMENTS = [
  { id: 'ASM-101', patient: 'Aarav Patel', type: 'Initial Intake', status: 'Pending Review', date: 'Oct 24, 2024', risk: 'High', aiScore: 68 },
  { id: 'ASM-102', patient: 'Riya Sharma', type: 'Quarterly Progress', status: 'In Progress', date: 'Oct 23, 2024', risk: 'Low', aiScore: 82 },
  { id: 'ASM-103', patient: 'Kabir Singh', type: 'Behavioral Screener', status: 'Pending Review', date: 'Oct 22, 2024', risk: 'Medium', aiScore: 74 },
  { id: 'ASM-104', patient: 'Ananya Gupta', type: 'Speech Articulation', status: 'Completed', date: 'Oct 20, 2024', risk: 'High', aiScore: 45 },
];

const DoctorAssessments = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-gray-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
               <ClipboardList className="w-6 h-6" />
             </div>
             Assessment Review
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Review parent submissions and generate clinical reports.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              Batch Actions
           </button>
           <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors">
              New Assessment
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Column: Pipeline */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
               
               {/* Toolbar */}
               <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                  <div className="relative w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input type="text" placeholder="Search assessments..." className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all" />
                  </div>
                  <button className="p-2 bg-white border border-gray-200 text-gray-500 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-800 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
               </div>

               {/* List */}
               <div className="divide-y divide-gray-100 flex-1 overflow-auto">
                  {ASSESSMENTS.map((assessment) => (
                    <div key={assessment.id} className="p-5 hover:bg-gray-50/50 transition-colors group cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            assessment.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                            assessment.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {assessment.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> :
                             assessment.status === 'In Progress' ? <Clock className="w-5 h-5" /> :
                             <FileText className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-gray-800 group-hover:text-primary transition-colors">{assessment.patient}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">{assessment.id}</span>
                            </div>
                            <p className="text-xs font-bold text-gray-500 mt-1">{assessment.type}</p>
                            <p className="text-[11px] font-medium text-gray-400 mt-0.5">Submitted: {assessment.date}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-6 sm:justify-end pl-14 sm:pl-0">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">AI Score</p>
                            <p className={`text-sm font-black ${
                              assessment.risk === 'High' ? 'text-red-500' :
                              assessment.risk === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                            }`}>{assessment.aiScore} / 100</p>
                          </div>
                          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg shadow-sm hover:bg-gray-50 hover:text-primary transition-colors whitespace-nowrap flex items-center gap-1">
                             Review <ArrowRight className="w-3 h-3" />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Column: AI Analysis Preview (Placeholder for active selection) */}
         <div className="space-y-6">
            <div className="bg-gradient-to-b from-indigo-50 to-white rounded-2xl shadow-sm border border-indigo-100 p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <BrainCircuit className="w-48 h-48 text-indigo-600" />
               </div>
               
               <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/30">
                     <BrainCircuit className="w-5 h-5" />
                   </div>
                   <h3 className="text-base font-black text-gray-800">AI Pre-Analysis</h3>
                 </div>

                 <div className="bg-white rounded-xl p-5 border border-indigo-50 shadow-sm mb-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Selected Assessment</p>
                    <h4 className="text-sm font-black text-gray-800">Initial Intake (ASM-101)</h4>
                    <p className="text-xs font-bold text-gray-500 mb-4">Aarav Patel</p>
                    
                    <div className="flex justify-between items-end pb-4 border-b border-gray-100 mb-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Confidence Score</p>
                        <p className="text-2xl font-black text-gray-800">88%</p>
                      </div>
                      <div className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase tracking-wider">
                        High Risk Indicator
                      </div>
                    </div>

                    <div className="space-y-3">
                       <div>
                         <p className="text-xs font-bold text-gray-800 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Key Finding 1</p>
                         <p className="text-[11px] font-medium text-gray-600 mt-1 pl-5 leading-relaxed">Significant delay in expressive language. Non-verbal communication heavily relied upon.</p>
                       </div>
                       <div>
                         <p className="text-xs font-bold text-gray-800 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Key Finding 2</p>
                         <p className="text-[11px] font-medium text-gray-600 mt-1 pl-5 leading-relaxed">Motor skills are developing within normal parameters for age group.</p>
                       </div>
                    </div>
                 </div>

                 <button className="w-full py-3 mt-auto bg-white border border-indigo-200 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                   <FileText className="w-4 h-4" /> Generate Draft Report
                 </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DoctorAssessments;
