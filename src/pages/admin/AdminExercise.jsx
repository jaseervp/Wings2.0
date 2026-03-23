import { useState } from 'react';
import { Search, Plus, PlayCircle, Edit2, Trash2, Calendar } from 'lucide-react';

const VIDEOS = [
  { id: 1, title: 'Sensory Integration Basics', category: 'Occupational Therapy', duration: '12:45', age: '3 - 6 Years', views: '2.4k', thumb: 'bg-primary/20' },
  { id: 2, title: 'Motor Skills Fun', category: 'Physical Exercise', duration: '08:20', age: '0 - 2 Years', views: '1.1k', thumb: 'bg-accent/20' },
  { id: 3, title: 'Speech Intelligibility Drills', category: 'Speech Therapy', duration: '15:00', age: '4 - 6 Years', views: '3.8k', thumb: 'bg-secondary/20' },
];

const AdminExercise = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">Exercise & Therapy Videos</h2>
           <p className="text-muted font-medium text-sm mt-1">Manage video content library and structured weekly programs.</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2">
           <Plus className="w-4 h-4" /> Upload Video
        </button>
      </div>

      {/* Structured Programs Notice */}
      <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border p-5 flex flex-col md:flex-row gap-6 justify-between items-center bg-gradient-to-r from-white to-primary/5">
         <div>
           <h3 className="font-admin-heading font-bold text-text flex items-center gap-2">
             <Calendar className="w-5 h-5 text-primary" /> Structured Exercise Programs
           </h3>
           <p className="text-sm text-muted mt-1 max-w-2xl font-medium">Create sequential 7-day or 30-day exercise routines by grouping videos from the library. You can assign these programs to specific child profiles or age brackets.</p>
         </div>
         <button className="whitespace-nowrap px-4 py-2 border border-admin-border bg-white text-text font-bold rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
           Create Program
         </button>
      </div>

      <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border flex flex-col">
        <div className="p-4 border-b border-admin-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <h3 className="font-admin-heading font-bold text-text">Video Library</h3>
           <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search videos by title or category..." className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-admin-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {VIDEOS.map(video => (
              <div key={video.id} className="group border border-admin-border rounded-xl overflow-hidden hover:shadow-md transition-all">
                 <div className={`h-32 ${video.thumb} relative flex items-center justify-center`}>
                    <PlayCircle className="w-12 h-12 text-white opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                      {video.duration}
                    </span>
                 </div>
                 <div className="p-4 flex flex-col shrink-0">
                    <h4 className="font-bold text-sm text-text line-clamp-2 leading-tight group-hover:text-primary transition-colors">{video.title}</h4>
                    <p className="text-xs text-muted mt-1">{video.category}</p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-admin-border justify-between text-[11px] font-bold text-muted font-mono">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded">{video.age}</span>
                      <span>{video.views} views</span>
                    </div>
                 </div>
                 <div className="px-4 pb-4 flex gap-2">
                    <button className="flex-1 py-1.5 bg-gray-50 border border-admin-border rounded text-muted hover:text-text hover:bg-white text-xs font-bold transition-colors flex items-center justify-center gap-2">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button className="px-3 py-1.5 bg-gray-50 border border-admin-border rounded text-muted hover:text-admin-danger hover:bg-admin-danger/5 text-xs font-bold transition-colors flex items-center justify-center">
                      <Trash2 className="w-3 h-3" />
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
