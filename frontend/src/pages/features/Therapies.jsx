import { useState } from 'react';
import { 
  Target, MessageCircle, HeartPulse, BrainCircuit, Play, CheckCircle2, 
  Circle, Calendar, Clock, Flame, Award, Bot, MessageSquare, UploadCloud, ChevronRight,
  TrendingUp, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const THERAPIES = [
  { 
    id: 'occupational', title: 'Occupational Therapy', icon: Target, 
    color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary',
    progress: 75, completed: 12, total: 16, therapist: 'Dr. Sarah Jenkins', nextSession: 'Tomorrow, 10:00 AM'
  },
  { 
    id: 'behavioral', title: 'Behavioral Therapy', icon: BrainCircuit, 
    color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent',
    progress: 40, completed: 4, total: 10, therapist: 'Mark Ruffalo, BCBA', nextSession: 'Jun 22, 2:00 PM'
  },
  { 
    id: 'speech', title: 'Speech Therapy', icon: MessageCircle, 
    color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary',
    progress: 60, completed: 9, total: 15, therapist: 'Emily Chen, SLP', nextSession: 'Jun 24, 11:30 AM'
  },
  { 
    id: 'physio', title: 'Physiotherapy', icon: HeartPulse, 
    color: 'text-success', bg: 'bg-success/10', border: 'border-success',
    progress: 20, completed: 2, total: 10, therapist: 'David Kim, PT', nextSession: 'Jul 01, 9:00 AM'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const Therapies = () => {
  const [activeTab, setActiveTab] = useState('occupational');
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Prepare materials (blocks & cups)", done: true },
    { id: 2, text: "Watch instructional video", done: true },
    { id: 3, text: "Practice sorting by color (10 mins)", done: false },
    { id: 4, text: "Practice sorting by shape (10 mins)", done: false },
    { id: 5, text: "Record progress and upload clip", done: false },
  ]);

  const toggleChecklist = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  const activeTherapyData = THERAPIES.find(t => t.id === activeTab);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-6">
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* 1. Hero Therapy Journey */}
        <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 sm:p-10 border border-white bg-gradient-to-br from-primary to-blue-700 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -ml-20 -mb-20" />
          
          <div className="relative z-10 flex items-center gap-6">
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Aarav&backgroundColor=ffffff" 
              alt="Aarav" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/30 shadow-lg bg-white"
            />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-bold mb-3 shadow-sm">
                <Target className="w-4 h-4" /> Today's Focus: Fine Motor
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold mb-1">Aarav's Journey</h2>
              <p className="text-blue-100 font-medium">Keep up the great work! You're making excellent progress.</p>
            </div>
          </div>
          
          <div className="relative z-10 flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
              <Flame className="w-8 h-8 text-accent mb-2 drop-shadow-sm" />
              <span className="text-2xl font-heading font-black">5 Days</span>
              <span className="text-xs text-blue-100 font-semibold uppercase tracking-wider">Streak</span>
            </div>
            <div className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
              <Calendar className="w-8 h-8 text-white mb-2 drop-shadow-sm" />
              <span className="text-xl font-heading font-black mt-1 text-center leading-tight">Tom, 10am</span>
              <span className="text-xs text-blue-100 font-semibold uppercase tracking-wider mt-1">Next Appt</span>
            </div>
          </div>
        </motion.div>

        {/* 2. Therapy Programs */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-end mb-6">
            <h3 className="font-heading font-extrabold text-2xl text-text">Active Programs</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {THERAPIES.map(therapy => {
              const isActive = activeTab === therapy.id;
              return (
                <button 
                  key={therapy.id}
                  onClick={() => setActiveTab(therapy.id)}
                  className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-start gap-5 text-left relative overflow-hidden group
                    ${isActive 
                      ? `${therapy.border} ${therapy.bg} shadow-lg scale-[1.02] z-10` 
                      : 'border-white glass hover:border-gray-200 hover:bg-white/60'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div layoutId="activeTherapyBg" className={`absolute inset-0 opacity-50 ${therapy.bg}`} />
                  )}
                  <div className="relative z-10 w-full flex justify-between items-start">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm bg-white border ${isActive ? therapy.color + ' ' + therapy.border : 'text-gray-400 border-gray-100'}`}>
                      <therapy.icon className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-black font-heading ${isActive ? therapy.color : 'text-text'}`}>
                        {therapy.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="relative z-10 w-full">
                    <h3 className={`font-bold mb-1 ${isActive ? therapy.color : 'text-text'}`}>{therapy.title}</h3>
                    <p className="text-xs text-muted font-semibold flex items-center gap-1 mb-4">
                      <Activity className="w-3.5 h-3.5" /> {therapy.completed} of {therapy.total} sessions
                    </p>
                    <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isActive ? therapy.bg.replace('/10', '') : 'bg-gray-300'}`} 
                        style={{ width: `${therapy.progress}%` }} 
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 3. Today's Therapy Session */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`px-3 py-1 text-xs font-bold rounded-lg border flex items-center gap-1.5 ${activeTherapyData.bg} ${activeTherapyData.color} ${activeTherapyData.border}`}>
                  <activeTherapyData.icon className="w-3.5 h-3.5" /> {activeTherapyData.title}
                </span>
                <span className="px-3 py-1 text-xs font-bold rounded-lg border border-border/50 bg-gray-50 flex items-center gap-1.5 text-muted">
                  <Clock className="w-3.5 h-3.5" /> 20 Mins
                </span>
                <span className="px-3 py-1 text-xs font-bold rounded-lg border border-border/50 bg-gray-50 flex items-center gap-1.5 text-muted">
                  <Target className="w-3.5 h-3.5" /> Difficulty: Medium
                </span>
              </div>

              <div className="aspect-video bg-gray-900 rounded-[2rem] relative overflow-hidden mb-8 shadow-md group">
                 <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1200" alt="Therapy Session" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-500" />
                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                 
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className={`w-20 h-20 text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer group-hover:scale-110 transition-transform ${activeTherapyData.bg.replace('/10', '')} shadow-${activeTherapyData.color.split('-')[1]}/50`}>
                     <Play className="w-8 h-8 ml-1" />
                   </div>
                 </div>
                 
                 <div className="absolute bottom-6 left-6 right-6">
                   <h3 className="text-2xl sm:text-3xl font-heading font-black text-white mb-2 drop-shadow-md">Session {activeTherapyData.completed + 1}: Fine Motor Skills</h3>
                   <p className="text-gray-200 font-medium drop-shadow text-sm sm:text-base">Today's focus is on developing pincer grasps using safe household object sorting.</p>
                 </div>
              </div>

              {/* 4. Activity Board */}
              <div>
                <h4 className="font-heading font-bold text-xl text-text mb-4">Activity Checklist</h4>
                <div className="grid gap-3">
                  {checklist.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => toggleChecklist(item.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group
                        ${item.done 
                          ? 'bg-gray-50/50 border-gray-100 opacity-70' 
                          : 'bg-white border-white shadow-sm hover:border-primary/30 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="shrink-0 relative">
                        {item.done 
                          ? <CheckCircle2 className="w-7 h-7 text-primary" /> 
                          : <Circle className="w-7 h-7 text-gray-300 group-hover:text-primary/50 transition-colors" />
                        }
                      </div>
                      <span className={`font-semibold text-base transition-all ${item.done ? 'text-muted line-through' : 'text-text'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 7. Achievement System */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-bold text-xl text-text flex items-center gap-2">
                  <Award className="w-6 h-6 text-accent" /> Recent Achievements
                </h3>
                <button className="text-sm font-bold text-primary hover:text-blue-700 transition-colors">View All</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { title: "3-Day Streak", icon: Flame, color: "text-accent", bg: "bg-accent/10" },
                  { title: "First Puzzle", icon: BrainCircuit, color: "text-primary", bg: "bg-primary/10" },
                  { title: "Good Listener", icon: MessageCircle, color: "text-secondary", bg: "bg-secondary/10" },
                  { title: "Motor Master", icon: Target, color: "text-success", bg: "bg-success/10", locked: true },
                ].map((badge, i) => (
                  <div key={i} className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${badge.locked ? 'bg-gray-50 border-gray-100 opacity-60 grayscale' : 'bg-white border-white shadow-sm hover:-translate-y-1 hover:shadow-md'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${badge.locked ? 'bg-gray-200 text-gray-400' : `${badge.bg} ${badge.color}`}`}>
                      <badge.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-text leading-tight">{badge.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-8">
            
            {/* 5. AI Therapy Coach */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <Bot className="w-40 h-40 text-indigo-600" />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm border border-indigo-200">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-indigo-900">AI Coach Tip</h3>
              </div>
              <p className="text-sm text-indigo-900/80 font-medium leading-relaxed relative z-10 mb-4">
                Since Aarav is working on fine motor skills today, try placing his snacks in a small container with a lid. Having him open it himself is great passive practice!
              </p>
            </motion.div>

            {/* 6. Therapist Feedback */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6">
              <div className="flex items-center gap-3 mb-6">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=b6e3f4" alt="Therapist" className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-white" />
                <div>
                  <h4 className="font-bold text-text text-sm">{activeTherapyData.therapist}</h4>
                  <p className="text-xs text-muted font-semibold">{activeTherapyData.title} Lead</p>
                </div>
              </div>
              <div className="bg-gray-50 border border-border/50 rounded-2xl p-4 relative">
                <div className="absolute top-4 left-4 text-gray-300">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <p className="text-sm text-muted font-medium italic pl-8">
                  "Aarav did exceptionally well with the block stacking exercise last week. Let's introduce smaller blocks this session to challenge his pincer grasp further."
                </p>
              </div>
            </motion.div>

            {/* 8. Video Upload Area */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-text mb-2">Upload Assignment</h3>
              <p className="text-sm text-muted mb-6 leading-relaxed">
                Record a short clip of Aarav completing the activity for {activeTherapyData.therapist} to review.
              </p>
              
              <div className="w-full border-2 border-dashed border-gray-300 rounded-[2rem] p-8 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer group">
                <p className="text-sm font-bold text-gray-500 group-hover:text-primary transition-colors">
                  Drag & drop video here<br/>
                  <span className="text-xs font-medium text-gray-400 mt-1 block">or click to browse</span>
                </p>
              </div>
            </motion.div>

            <motion.button variants={itemVariants} className="w-full py-4 bg-primary text-white rounded-2xl font-extrabold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
              Mark Session Complete <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Therapies;
