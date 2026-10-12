import { useState } from 'react';
import { Video, Play, MessageSquare, CheckCircle2, RotateCcw, AlertCircle, Search, Filter } from 'lucide-react';

const VIDEOS = [
  { id: 1, patient: 'Aarav Patel', type: 'Speech Articulation', title: 'Bilabial Sounds Practice', duration: '2:14', status: 'Pending', date: '2 hours ago', thumbnail: 'bg-blue-100' },
  { id: 2, patient: 'Riya Sharma', type: 'Motor Skills', title: 'Block Stacking Exercise', duration: '4:05', status: 'Pending', date: '5 hours ago', thumbnail: 'bg-emerald-100' },
  { id: 3, patient: 'Kabir Singh', type: 'Behavioral', title: 'Tantrum Recovery', duration: '1:45', status: 'Reviewed', date: 'Yesterday', thumbnail: 'bg-purple-100' },
  { id: 4, patient: 'Ananya Gupta', type: 'Speech Articulation', title: 'Vowel Sounds', duration: '3:20', status: 'Needs Resubmission', date: '2 days ago', thumbnail: 'bg-amber-100' },
];

const DoctorVideoReviews = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-gray-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
               <Video className="w-6 h-6" />
             </div>
             Video Reviews
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Review and provide feedback on parent-submitted therapy videos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Column: Video Feed */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
               
               <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                  <div className="relative w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input type="text" placeholder="Search videos..." className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all" />
                  </div>
                  <button className="p-2 bg-white border border-gray-200 text-gray-500 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-800 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
               </div>

               <div className="divide-y divide-gray-100">
                  {VIDEOS.map((video) => (
                    <div key={video.id} className="p-5 hover:bg-gray-50/50 transition-colors group cursor-pointer">
                       <div className="flex flex-col sm:flex-row gap-5">
                          <div className={`w-32 h-20 rounded-xl ${video.thumbnail} flex items-center justify-center shrink-0 relative overflow-hidden`}>
                             <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                             <Play className="w-8 h-8 text-white relative z-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                             <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                               {video.duration}
                             </div>
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-black text-gray-800 group-hover:text-primary transition-colors">{video.title}</h4>
                                <p className="text-xs font-bold text-gray-500 mt-1">{video.patient} • {video.type}</p>
                              </div>
                              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                video.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                                video.status === 'Reviewed' ? 'bg-emerald-50 text-emerald-600' :
                                'bg-red-50 text-red-600'
                              }`}>
                                {video.status}
                              </div>
                            </div>
                            <div className="text-[11px] font-medium text-gray-400 mt-2">
                              Uploaded {video.date}
                            </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Column: Active Review Panel */}
         <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
               
               <div className="w-full aspect-video bg-gray-900 rounded-xl mb-6 relative flex items-center justify-center group overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
                  <Play className="w-12 h-12 text-white opacity-80 group-hover:scale-110 transition-transform relative z-10 cursor-pointer" />
               </div>

               <h3 className="text-lg font-black text-gray-800 mb-1">Bilabial Sounds Practice</h3>
               <p className="text-sm font-bold text-gray-500 mb-6">Aarav Patel • Speech Therapy</p>

               <div className="space-y-4 mb-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Parent Notes</p>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium text-gray-600 leading-relaxed">
                    "Aarav was a bit distracted today but we managed to get through the flashcards. He struggled slightly with the 'M' sound. Is this normal?"
                  </div>
               </div>

               <div className="space-y-4 mt-auto">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Feedback</p>
                  <textarea 
                    className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all resize-none font-medium text-gray-800 placeholder:text-gray-400"
                    placeholder="Provide constructive feedback for the parent..."
                  ></textarea>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                     <button className="py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                       <RotateCcw className="w-4 h-4" /> Resubmit
                     </button>
                     <button className="py-2.5 bg-emerald-600 border border-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-2">
                       <CheckCircle2 className="w-4 h-4" /> Approve
                     </button>
                  </div>
               </div>

            </div>
         </div>
      </div>
    </div>
  );
};

export default DoctorVideoReviews;
