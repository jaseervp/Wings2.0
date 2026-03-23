import { useState } from 'react';
import { Target, MessageCircle, HeartPulse, BrainCircuit, Play, CheckCircle2, Circle } from 'lucide-react';

const THERAPIES = [
  { id: 'occupational', title: 'Occupational Therapy', icon: Target, color: 'text-primary', bg: 'bg-primary/10', progress: 75 },
  { id: 'behavioral', title: 'Behavioral Therapy', icon: BrainCircuit, color: 'text-accent', bg: 'bg-accent/10', progress: 40 },
  { id: 'speech', title: 'Speech Therapy', icon: MessageCircle, color: 'text-secondary', bg: 'bg-secondary/10', progress: 60 },
  { id: 'physio', title: 'Physiotherapy', icon: HeartPulse, color: 'text-success', bg: 'bg-success/10', progress: 20 },
];

const Therapies = () => {
  const [activeTab, setActiveTab] = useState('occupational');

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading font-extrabold text-primary">Therapy Hub</h2>
          <p className="text-muted mt-1 font-medium">Track your child's tailored therapy sessions</p>
        </div>
      </div>

      {/* Therapy Type Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {THERAPIES.map(therapy => (
          <button 
            key={therapy.id}
            onClick={() => setActiveTab(therapy.id)}
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-start gap-4 text-left ${
              activeTab === therapy.id 
                ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 scale-105' 
                : 'border-white bg-white hover:border-gray-200'
            }`}
          >
            <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center ${therapy.bg} ${therapy.color}`}>
              <therapy.icon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-text mb-1">{therapy.title}</h3>
              <p className="text-xs text-muted font-bold">{therapy.progress}% Complete</p>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-auto overflow-hidden">
              <div 
                className={`h-full rounded-full ${activeTab === therapy.id ? 'bg-primary' : 'bg-gray-300'}`} 
                style={{ width: `${therapy.progress}%` }} 
              />
            </div>
          </button>
        ))}
      </div>

      {/* Active Therapy Content */}
      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Video/Activity Area */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="aspect-video bg-gray-900 rounded-2xl relative overflow-hidden mb-6 flex items-center justify-center">
               <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800" alt="Therapy Session" className="absolute inset-0 w-full h-full object-cover opacity-60" />
               <div className="w-20 h-20 bg-primary/90 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/50 relative z-10 cursor-pointer group-hover:scale-110 transition-transform">
                 <Play className="w-8 h-8 ml-1" />
               </div>
            </div>
            <h3 className="text-2xl font-heading font-black text-text mb-2">Session 4: Fine Motor Skills</h3>
            <p className="text-muted leading-relaxed">Today's focus is on developing pincer grasps using safe household object sorting.</p>
          </div>

          <div className="bg-bg rounded-3xl p-6 border border-gray-100 text-center">
            <h3 className="font-bold text-lg mb-4">Upload Assignment Video</h3>
            <p className="text-sm text-muted mb-6">Record a 1-minute clip of your child performing the activity for the therapist to review.</p>
            <button className="px-8 py-3 bg-white text-primary border-2 border-primary/20 border-dashed rounded-full font-bold hover:bg-primary hover:text-white transition-all">
              + Browse Files
            </button>
          </div>
        </div>

        {/* Sidebar Checklist */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 h-fit">
          <h3 className="font-heading font-extrabold text-xl text-primary mb-6">Activity Checklist</h3>
          <div className="space-y-4">
            {[
              { text: "Prepare materials (blocks & cups)", done: true },
              { text: "Watch instructional video", done: true },
              { text: "Practice sorting by color (10 mins)", done: false },
              { text: "Practice sorting by shape (10 mins)", done: false },
              { text: "Record progress and upload clip", done: false },
            ].map((item, i) => (
              <label key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                <input type="checkbox" className="hidden" defaultChecked={item.done} />
                <div className="mt-0.5 shrink-0">
                  {item.done ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <Circle className="w-6 h-6 text-gray-300" />}
                </div>
                <span className={`font-medium ${item.done ? 'text-muted line-through' : 'text-text'}`}>{item.text}</span>
              </label>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
            Mark Session Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Therapies;
