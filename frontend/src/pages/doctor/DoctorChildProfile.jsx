import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, FileText, ClipboardList, Activity, Video, Users, 
  Clock, Download, MessageSquare, Plus, CheckCircle2, AlertCircle
} from 'lucide-react';

const DoctorChildProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Assessments', 'Therapies', 'Videos', 'Medical Notes'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/doctor/children" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-primary transition-colors text-gray-500 shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
             <h2 className="text-2xl font-admin-heading font-black text-gray-800 tracking-tight">Patient Profile</h2>
             <p className="text-gray-500 font-medium text-sm mt-0.5">ID: WMH-PT-2024-{id || '001'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl shadow-sm hover:bg-gray-50 hover:text-primary transition-all flex items-center gap-2">
             <Download className="w-4 h-4" /> Export Record
          </button>
          <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
             <MessageSquare className="w-4 h-4" /> Message Parents
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 flex flex-col lg:flex-row gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full -z-0 opacity-50"></div>
         
         <div className="flex items-center gap-6 relative z-10 lg:w-1/3 shrink-0 lg:border-r border-gray-100 pr-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-primary font-black text-3xl shadow-sm border-4 border-white shrink-0">
              A
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight mb-1">Aarav Patel</h1>
              <p className="text-sm font-bold text-gray-500 mb-3">4 years, 2 months • Male</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 text-xs font-bold uppercase tracking-wider">
                 Autism Spectrum • Level 2
              </div>
            </div>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 relative z-10">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Primary Parent</p>
              <p className="text-sm font-black text-gray-800">Neha Patel</p>
              <p className="text-xs font-bold text-gray-500 mt-0.5">+91 98765 43210</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Admission Date</p>
              <p className="text-sm font-black text-gray-800">Jan 12, 2024</p>
              <p className="text-xs font-bold text-gray-500 mt-0.5">10 months ago</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Latest Score</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-gray-800">68</span>
                <span className="text-xs font-bold text-emerald-600">/ 100</span>
              </div>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5 flex items-center gap-1"><Activity className="w-3 h-3" /> +12% YoY</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Next Appt</p>
              <p className="text-sm font-black text-gray-800">Oct 26, 10:00 AM</p>
              <p className="text-xs font-bold text-primary mt-0.5">Speech Therapy</p>
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
         {tabs.map(tab => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
               activeTab === tab 
               ? 'bg-gray-800 text-white shadow-md' 
               : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
             }`}
           >
             {tab}
           </button>
         ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         
         <div className="xl:col-span-2 space-y-8">
            {activeTab === 'Overview' && (
              <>
                 {/* Progress & Analytics Snapshot */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black text-gray-800">Progress Overview</h3>
                      <button className="text-sm font-bold text-primary hover:underline">Full Analytics</button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                       <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Speech & Language</p>
                         <div className="flex justify-between items-end mb-2">
                           <span className="text-2xl font-black text-gray-800">45%</span>
                           <span className="text-xs font-bold text-emerald-600">+5%</span>
                         </div>
                         <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 rounded-full w-[45%]"></div>
                         </div>
                       </div>
                       <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Motor Skills</p>
                         <div className="flex justify-between items-end mb-2">
                           <span className="text-2xl font-black text-gray-800">72%</span>
                           <span className="text-xs font-bold text-emerald-600">+12%</span>
                         </div>
                         <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 rounded-full w-[72%]"></div>
                         </div>
                       </div>
                       <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Social Behavior</p>
                         <div className="flex justify-between items-end mb-2">
                           <span className="text-2xl font-black text-gray-800">60%</span>
                           <span className="text-xs font-bold text-emerald-600">+8%</span>
                         </div>
                         <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                           <div className="h-full bg-purple-500 rounded-full w-[60%]"></div>
                         </div>
                       </div>
                    </div>
                 </div>

                 {/* Recent Clinical Notes */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                      <h3 className="text-lg font-black text-gray-800">Recent Clinical Notes</h3>
                      <button className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 hover:text-primary transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                       <div className="p-6 hover:bg-gray-50/30 transition-colors">
                         <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold text-xs">Dr.S</div>
                             <div>
                               <p className="text-sm font-black text-gray-800">Speech Therapy Session</p>
                               <p className="text-[11px] font-bold text-gray-400">Oct 24, 2024 • 11:30 AM</p>
                             </div>
                           </div>
                         </div>
                         <p className="text-sm font-medium text-gray-600 mt-3 leading-relaxed">
                           Aarav showed excellent progress today. Successfully articulated "B" and "P" sounds consistently for 10 minutes using the mirror exercise. Attempted 2-word combinations ("Big Ball"). Needs continued practice on fricatives at home.
                         </p>
                       </div>
                       <div className="p-6 hover:bg-gray-50/30 transition-colors">
                         <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">Dr.M</div>
                             <div>
                               <p className="text-sm font-black text-gray-800">Occupational Therapy</p>
                               <p className="text-[11px] font-bold text-gray-400">Oct 18, 2024 • 09:00 AM</p>
                             </div>
                           </div>
                         </div>
                         <p className="text-sm font-medium text-gray-600 mt-3 leading-relaxed">
                           Worked on fine motor skills using pegboards. Grip strength has improved. Reduced sensory sensitivity observed when playing with kinetic sand.
                         </p>
                       </div>
                    </div>
                 </div>
              </>
            )}
            
            {activeTab !== 'Overview' && (
               <div className="h-[400px] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center p-8 animate-in fade-in">
                 <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                   <FileText className="w-8 h-8 text-gray-300" />
                 </div>
                 <h3 className="text-xl font-admin-heading font-black text-gray-800 mb-2">{activeTab} Details</h3>
                 <p className="text-gray-500 font-medium max-w-sm text-sm">Detailed views for {activeTab.toLowerCase()} are currently being assembled for this patient record.</p>
               </div>
            )}
         </div>

         {/* Right Sidebar - Care Team & Quick Info */}
         <div className="space-y-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                 <h3 className="text-base font-black text-gray-800">Assigned Care Team</h3>
              </div>
              <div className="p-5 space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden">
                     <img src="https://ui-avatars.com/api/?name=Sarah+Smith&background=2563EB&color=fff" alt="Team" className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <p className="text-sm font-black text-gray-800">Dr. Sarah Smith</p>
                     <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Lead Speech Therapist</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden">
                     <img src="https://ui-avatars.com/api/?name=Maya+Roy&background=14B8A6&color=fff" alt="Team" className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <p className="text-sm font-black text-gray-800">Dr. Maya Roy</p>
                     <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Occupational Therapist</p>
                   </div>
                 </div>

                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center border-dashed border-gray-300 text-gray-400 hover:text-primary hover:border-primary/50 cursor-pointer transition-colors">
                     <Plus className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="text-sm font-black text-gray-500">Assign Specialist</p>
                   </div>
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                 <h3 className="text-base font-black text-gray-800">Clinical Alerts</h3>
              </div>
              <div className="p-5 space-y-3">
                 <div className="flex gap-3 items-start p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-gray-800">Sensory Sensitivity</p>
                      <p className="text-[11px] font-medium text-gray-600 mt-0.5">Extreme aversion to loud noises. Use quiet rooms for sessions.</p>
                    </div>
                 </div>
                 <div className="flex gap-3 items-start p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-gray-800">Assessment Due</p>
                      <p className="text-[11px] font-medium text-gray-600 mt-0.5">Quarterly progress assessment is due in 5 days.</p>
                    </div>
                 </div>
              </div>
            </div>

         </div>

      </div>
    </div>
  );
};

export default DoctorChildProfile;
