import { Flame, Play, CheckCircle2 } from 'lucide-react';

const EXERCISES = [
  { id: 1, title: 'Deep Pressure Therapy', category: 'Sensory', duration: '5 min', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400' },
  { id: 2, title: 'Balance Board Routine', category: 'Motor', duration: '10 min', img: 'https://images.unsplash.com/photo-1544640808-32caaefce5ed?auto=format&fit=crop&q=80&w=400' },
  { id: 3, title: 'Object Tracking', category: 'Cognitive', duration: '3 min', img: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=400' },
  { id: 4, title: 'Crossed Leg Stretches', category: 'Motor', duration: '8 min', img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=400' },
];

const Exercise = () => {
  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Streak */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-primary to-accent rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-primary/20">
        <div>
          <h2 className="text-4xl font-heading font-black mb-2">Exercise Library</h2>
          <p className="text-white/80 font-medium text-lg">Daily routines to improve motor and sensory skills.</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 mt-6 md:mt-0">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex flex-col items-center justify-center shadow-inner">
            <Flame className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold opacity-90 uppercase tracking-wider">Current Streak</h4>
            <p className="text-3xl font-black font-heading leading-tight drop-shadow-md">7 Days</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Videos List */}
        <div className="lg:col-span-2">
          <h3 className="font-heading font-black text-2xl text-text mb-6">Recommended for Today</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {EXERCISES.map((ex) => (
              <div key={ex.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 group border-b-4 border-b-white hover:border-b-primary transition-all cursor-pointer">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 mb-4">
                  <img src={ex.img} alt={ex.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded inline-flex">
                    {ex.duration}
                  </div>
                </div>
                <div>
                  <div className="inline-block px-2 py-1 bg-gray-100 text-muted font-bold text-xs rounded mb-2 uppercase tracking-wide">
                    {ex.category}
                  </div>
                  <h4 className="font-bold text-lg text-text group-hover:text-primary transition-colors">{ex.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Log Checklist */}
        <div>
           <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-24">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-heading font-extrabold text-xl text-primary">Daily Log</h3>
               <span className="text-sm font-bold text-muted">2 / 4 done</span>
             </div>
             
             <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
               <div className="h-full bg-success w-1/2 rounded-full"></div>
             </div>

             <div className="space-y-4">
               {[
                 { title: "Deep Pressure Therapy", done: true },
                 { title: "Balance Board Routine", done: true },
                 { title: "Object Tracking", done: false },
                 { title: "Crossed Leg Stretches", done: false }
               ].map((task, i) => (
                 <label key={i} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${task.done ? 'bg-success/5 border-success/20' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}>
                   <span className={`font-bold ${task.done ? 'text-success/80 line-through' : 'text-text'}`}>{task.title}</span>
                   {task.done ? <CheckCircle2 className="w-6 h-6 text-success fill-success bg-white rounded-full" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>}
                 </label>
               ))}
             </div>
           </div>
        </div>
        
      </div>
    </div>
  );
};

export default Exercise;
