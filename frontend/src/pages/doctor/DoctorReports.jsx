import { useState } from 'react';
import { FileText, Search, Filter, Download, ChevronRight, CheckSquare, Plus, FileOutput } from 'lucide-react';

const REPORTS = [
  { id: 'REP-204', patient: 'Aarav Patel', type: 'Clinical Progress Report', date: 'Oct 24, 2024', status: 'Draft', format: 'Clinical' },
  { id: 'REP-203', patient: 'Riya Sharma', type: 'Monthly Summary', date: 'Oct 20, 2024', status: 'Generated', format: 'Parent-Friendly' },
  { id: 'REP-202', patient: 'Kabir Singh', type: 'Assessment Results', date: 'Oct 15, 2024', status: 'Generated', format: 'Clinical' },
  { id: 'REP-201', patient: 'Ananya Gupta', type: 'Therapy Discharge', date: 'Oct 10, 2024', status: 'Signed', format: 'Clinical' },
];

const DoctorReports = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-gray-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
               <FileOutput className="w-6 h-6" />
             </div>
             Report Generation
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Generate clinical reports and parent-friendly summaries.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Column: Report List */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
               
               <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                  <div className="relative w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input type="text" placeholder="Search reports..." className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all" />
                  </div>
                  <button className="p-2 bg-white border border-gray-200 text-gray-500 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-800 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
               </div>

               <div className="divide-y divide-gray-100">
                  {REPORTS.map((report) => (
                    <div key={report.id} className="p-5 hover:bg-gray-50/50 transition-colors group cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            report.format === 'Clinical' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-gray-800 group-hover:text-primary transition-colors">{report.type}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">{report.id}</span>
                            </div>
                            <p className="text-xs font-bold text-gray-500 mt-1">{report.patient} • {report.date}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4 sm:justify-end pl-14 sm:pl-0">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                            report.status === 'Draft' ? 'bg-amber-50 text-amber-600' :
                            report.status === 'Signed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {report.status}
                          </span>
                          <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                            <Download className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Column: Report Generator */}
         <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
               <h3 className="text-base font-black text-gray-800 mb-6">Quick Generator</h3>
               
               <div className="space-y-4">
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Select Patient</label>
                   <select className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 outline-none font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm appearance-none">
                      <option>Aarav Patel (WMH-PT-2024-001)</option>
                      <option>Riya Sharma (WMH-PT-2024-002)</option>
                   </select>
                 </div>

                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Report Template</label>
                   <select className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 outline-none font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm appearance-none">
                      <option>Comprehensive Clinical Progress</option>
                      <option>Parent-Friendly Monthly Summary</option>
                      <option>Assessment Results (Detailed)</option>
                   </select>
                 </div>

                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Include Sections</label>
                   <div className="space-y-2">
                     <label className="flex items-center gap-2 text-sm font-bold text-gray-600 cursor-pointer">
                       <CheckSquare className="w-4 h-4 text-primary" /> Assessment Scores
                     </label>
                     <label className="flex items-center gap-2 text-sm font-bold text-gray-600 cursor-pointer">
                       <CheckSquare className="w-4 h-4 text-primary" /> Therapy Session Logs
                     </label>
                     <label className="flex items-center gap-2 text-sm font-bold text-gray-600 cursor-pointer">
                       <CheckSquare className="w-4 h-4 text-primary" /> AI Clinical Insights
                     </label>
                     <label className="flex items-center gap-2 text-sm font-bold text-gray-600 cursor-pointer">
                       <CheckSquare className="w-4 h-4 text-primary" /> Therapist Recommendations
                     </label>
                   </div>
                 </div>

                 <button className="w-full py-3 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 mt-4">
                   Generate Draft (PDF)
                 </button>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default DoctorReports;
