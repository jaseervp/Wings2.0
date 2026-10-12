import { useState } from 'react';
import { Search, Plus, PlayCircle, Edit2, Trash2, Calendar, Activity, Upload, Filter } from 'lucide-react';

const VIDEOS = [
  { id: 1, title: 'Sensory Integration Basics', category: 'Occupational Therapy', duration: '12:45', age: '3 - 6 Years', views: '2.4k', thumb: 'bg-emerald-500' },
  { id: 2, title: 'Motor Skills Fun', category: 'Physical Exercise', duration: '08:20', age: '0 - 2 Years', views: '1.1k', thumb: 'bg-blue-500' },
  { id: 3, title: 'Speech Intelligibility Drills', category: 'Speech Therapy', duration: '15:00', age: '4 - 6 Years', views: '3.8k', thumb: 'bg-purple-500' },
  { id: 4, title: 'Core Strengthening', category: 'Physical Exercise', duration: '10:30', age: '7 - 12 Years', views: '856', thumb: 'bg-amber-500' },
  { id: 5, title: 'Emotional Regulation', category: 'Behavioral Therapy', duration: '20:15', age: '4 - 8 Years', views: '1.9k', thumb: 'bg-rose-500' },
];

const AdminExercise = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight flex items-center gap-3">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
               <Activity className="w-6 h-6" />
             </div>
             Exercise & Therapy Programs
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Manage video content library, structured routines, and home programs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/30 hover:bg-primary/90 hover:shadow-md transition-all flex items-center gap-2">
             <Upload className="w-4 h-4" /> Upload Video
          </button>
        </div>
      </div>

      {/* Structured Programs Notice */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden group">
         <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-transparent to-blue-50/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
         
         <div className="flex gap-5 items-start">
           <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm mt-1 text-blue-600 group-hover:scale-105 transition-transform">
             <Calendar className="w-6 h-6" />
           </div>
           <div>
             <h3 className="font-admin-heading font-black text-text text-lg tracking-tight">Structured Exercise Programs</h3>
             <p className="text-sm text-gray-500 mt-1 max-w-2xl font-medium leading-relaxed">Create sequential 7-day or 30-day exercise routines by grouping videos from the library. You can assign these programs to specific child profiles based on age and developmental level.</p>
           </div>
         </div>
         <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:text-primary hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center gap-2 text-sm shadow-sm">
           Create Program <Plus className="w-4 h-4" />
         </button>
      </div>

      {/* Video Library */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
           <h3 className="font-admin-heading font-bold text-text text-lg">Video Library</h3>
           <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
             <div className="relative w-full sm:w-72 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input type="text" placeholder="Search videos by title or category..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 font-medium" />
             </div>
             <div className="relative w-full sm:w-auto">
                <select className="w-full sm:w-48 bg-white border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors">
                  <option>All Categories</option>
                  <option>Occupational</option>
                  <option>Physical</option>
                  <option>Speech</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Filter className="w-4 h-4" />
                </div>
              </div>
           </div>
        </div>
        
        {/* Video Grid */}
        <div className="p-6 bg-gray-50/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {VIDEOS.map(video => (
              <div key={video.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all flex flex-col">
                 
                 {/* Thumbnail */}
                 <div className={`h-40 ${video.thumb} relative flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    
                    <PlayCircle className="w-12 h-12 text-white/90 group-hover:scale-110 group-hover:text-white transition-all drop-shadow-lg z-20" />
                    
                    <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[11px] font-mono font-bold px-2 py-1 rounded-md z-20 border border-white/10 shadow-sm">
                      {video.duration}
                    </span>
                 </div>
                 
                 {/* Content */}
                 <div className="p-5 flex flex-col flex-1">
                    <h4 className="font-admin-heading font-black text-text line-clamp-2 leading-tight group-hover:text-primary transition-colors text-base mb-1.5">{video.title}</h4>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{video.category}</p>
                    
                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100 justify-between text-xs font-bold text-gray-500 font-mono">
                      <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">{video.age}</span>
                      <span>{video.views} views</span>
                    </div>
                 </div>
                 
                 {/* Actions */}
                 <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex-1 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-primary hover:border-blue-200 hover:bg-blue-50 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-bold transition-all flex items-center justify-center shadow-sm">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminExercise;
