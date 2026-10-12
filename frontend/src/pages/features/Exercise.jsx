import { useState } from 'react';
import { 
  Flame, Play, CheckCircle2, Circle, Activity, Target, Award, 
  Bot, Clock, MessageSquare, History, ChevronRight, BrainCircuit
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const EXERCISES = [
  { id: 1, title: 'Deep Pressure Therapy', category: 'Sensory', duration: '5 min', difficulty: 'Low', recommended: true, img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400', color: 'text-purple-500', bg: 'bg-purple-100', completed: true },
  { id: 2, title: 'Balance Board Routine', category: 'Motor', duration: '10 min', difficulty: 'Medium', recommended: true, img: 'https://images.unsplash.com/photo-1544640808-32caaefce5ed?auto=format&fit=crop&q=80&w=400', color: 'text-primary', bg: 'bg-primary/10', completed: true },
  { id: 3, title: 'Object Tracking', category: 'Cognitive', duration: '3 min', difficulty: 'Low', recommended: false, img: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=400', color: 'text-accent', bg: 'bg-accent/10', completed: false },
  { id: 4, title: 'Crossed Leg Stretches', category: 'Motor', duration: '8 min', difficulty: 'Low', recommended: false, img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=400', color: 'text-primary', bg: 'bg-primary/10', completed: false },
];

const SKILL_DATA = [
  { subject: 'Fine Motor', A: 85, fullMark: 100 },
  { subject: 'Balance', A: 65, fullMark: 100 },
  { subject: 'Attention', A: 90, fullMark: 100 },
  { subject: 'Visual Tracking', A: 75, fullMark: 100 },
  { subject: 'Communication', A: 80, fullMark: 100 },
];

const HISTORY = [
  { id: 1, date: 'Today, 9:00 AM', title: 'Sensory Integration', duration: '15 min', status: 'completed' },
  { id: 2, date: 'Yesterday, 4:30 PM', title: 'Gross Motor Skills', duration: '20 min', status: 'completed' },
  { id: 3, date: 'Wed, 10:15 AM', title: 'Focus & Attention', duration: '10 min', status: 'completed' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const Exercise = () => {
  const [exercises, setExercises] = useState(EXERCISES);

  const toggleExercise = (id) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    ));
  };

  const completedCount = exercises.filter(ex => ex.completed).length;
  const progressPercent = Math.round((completedCount / exercises.length) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-6">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-extrabold text-primary mb-2">Activity Hub</h2>
        <p className="text-muted font-medium">Therapeutic activities for motor and cognitive development</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* 1. Child Activity Hero Section */}
        <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 sm:p-10 border border-white bg-gradient-to-br from-indigo-600 to-primary text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -ml-20 -mb-20" />
          
          <div className="relative z-10 flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white/30 p-1">
                <img 
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Aarav&backgroundColor=ffffff" 
                  alt="Aarav" 
                  className="w-full h-full rounded-full shadow-lg bg-white"
                />
              </div>
              <svg className="absolute inset-0 w-24 h-24 -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                <motion.circle 
                  cx="50" cy="50" r="46" fill="transparent" stroke="#F59E0B" strokeWidth="6"
                  strokeDasharray="289"
                  initial={{ strokeDashoffset: 289 }}
                  animate={{ strokeDashoffset: 289 - (289 * progressPercent) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-bold mb-3 shadow-sm">
                <Target className="w-4 h-4 text-accent" /> Daily Target: 4 Activities
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold mb-1">Activity Journey</h2>
              <p className="text-indigo-100 font-medium">{progressPercent}% of daily therapy completed</p>
            </div>
          </div>
          
          <div className="relative z-10 flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
              <Flame className="w-8 h-8 text-accent mb-2 drop-shadow-sm" />
              <span className="text-2xl font-heading font-black">7 Days</span>
              <span className="text-xs text-indigo-100 font-semibold uppercase tracking-wider">Streak</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 2. Recommended Activities */}
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-end mb-6">
                <h3 className="font-heading font-extrabold text-2xl text-text">Recommended for Today</h3>
                <span className="text-sm font-bold text-primary hover:text-blue-700 cursor-pointer">View All</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {exercises.map((ex) => (
                  <div key={ex.id} className="glass bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 group border-b-4 border-b-white hover:border-b-primary transition-all flex flex-col h-full">
                    <div className="relative aspect-video rounded-[1.5rem] overflow-hidden bg-gray-900 mb-4 cursor-pointer">
                      <img src={ex.img} alt={ex.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-primary transition-colors shadow-lg">
                          <Play className="w-6 h-6 text-white ml-1 fill-white" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-md bg-white/90 ${ex.color}`}>
                          {ex.category}
                        </span>
                        {ex.recommended && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-md bg-accent/90 text-white flex items-center gap-1">
                            <Target className="w-3 h-3" /> Therapist Pick
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {ex.duration}
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="mb-4">
                        <h4 className="font-bold text-lg text-text leading-tight mb-1 group-hover:text-primary transition-colors">{ex.title}</h4>
                        <p className="text-sm text-muted font-medium">Difficulty: {ex.difficulty}</p>
                      </div>
                      <div 
                        onClick={() => toggleExercise(ex.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer mt-auto
                          ${ex.completed ? 'bg-success/5 border-success/20' : 'bg-gray-50 border-transparent hover:border-gray-200'}
                        `}
                      >
                        <div className="shrink-0">
                          {ex.completed ? <CheckCircle2 className="w-6 h-6 text-success fill-success bg-white rounded-full shadow-sm" /> : <Circle className="w-6 h-6 text-gray-300" />}
                        </div>
                        <span className={`font-semibold text-sm ${ex.completed ? 'text-success/80' : 'text-text'}`}>
                          {ex.completed ? 'Session Completed' : 'Mark as Complete'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 3 & 5. Daily Journey & Weekly Dashboard */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* 3. Daily Activity Journey */}
              <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-6 sm:p-8 border border-white">
                <h3 className="font-heading font-extrabold text-xl text-text mb-2">Today's Journey</h3>
                <p className="text-sm text-muted font-medium mb-6">Your customized activity pathway</p>
                
                <div className="space-y-0 relative">
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100 rounded-full" />
                  <div className="absolute left-6 top-6 w-0.5 bg-primary rounded-full transition-all duration-1000" style={{ height: `${progressPercent}%` }} />
                  
                  {exercises.map((task) => (
                    <div key={task.id} className="relative flex items-center gap-4 py-4 pl-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 border-[3px] transition-colors bg-white ${task.completed ? 'border-primary' : 'border-gray-200'}`}>
                        {task.completed && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <div className={`flex-1 p-4 rounded-2xl border transition-all ${task.completed ? 'bg-gray-50/50 border-gray-100' : 'bg-white border-white shadow-sm'}`}>
                        <h4 className={`font-bold text-sm ${task.completed ? 'text-muted line-through' : 'text-text'}`}>{task.title}</h4>
                        <p className="text-xs text-muted font-medium mt-0.5">{task.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 5. Weekly Development Dashboard */}
              <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-6 sm:p-8 border border-white flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-text">Skill Focus</h3>
                    <p className="text-sm text-muted">Weekly development areas</p>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="flex-1 w-full min-h-[220px] -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SKILL_DATA}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Aarav" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-8">
            
            {/* 4. AI Exercise Coach */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <Bot className="w-40 h-40 text-indigo-600" />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm border border-indigo-200">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-indigo-900">AI Activity Coach</h3>
              </div>
              <p className="text-sm text-indigo-900/80 font-medium leading-relaxed relative z-10 mb-4">
                Aarav did great with Object Tracking yesterday! For today's Balance Board routine, try playing his favorite music to help keep a steady rhythm.
              </p>
            </motion.div>

            {/* 6. Therapist Feedback */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6">
              <div className="flex items-center gap-3 mb-6">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=b6e3f4" alt="Therapist" className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-white" />
                <div>
                  <h4 className="font-bold text-text text-sm">Dr. Sarah Jenkins</h4>
                  <p className="text-xs text-muted font-semibold">Occupational Therapist</p>
                </div>
              </div>
              <div className="bg-gray-50 border border-border/50 rounded-2xl p-4 relative">
                <div className="absolute top-4 left-4 text-gray-300">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <p className="text-sm text-muted font-medium italic pl-8">
                  "Focus on deep pressure therapy before bedtime to help Aarav wind down. Continue the crossed leg stretches, he's showing great improvement in core stability."
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-bold">
                <span className="text-muted">Next Review:</span>
                <span className="text-primary">Jun 25, 2026</span>
              </div>
            </motion.div>

            {/* 7. Achievement System */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-accent/10 rounded-xl text-accent shadow-sm border border-accent/20">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-text">Milestones</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "7-Day Streak", icon: Flame, color: "text-accent", bg: "bg-accent/10" },
                  { title: "Sensory Master", icon: Target, color: "text-primary", bg: "bg-primary/10" },
                  { title: "Perfect Balance", icon: Activity, color: "text-success", bg: "bg-success/10", locked: true },
                ].map((badge, i) => (
                  <div key={i} className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${badge.locked ? 'bg-gray-50 border-gray-100 opacity-60 grayscale' : 'bg-white border-white shadow-sm hover:-translate-y-1 hover:shadow-md'} ${i === 2 ? 'col-span-2' : ''}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${badge.locked ? 'bg-gray-200 text-gray-400' : `${badge.bg} ${badge.color}`}`}>
                      <badge.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-text leading-tight">{badge.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 8. Activity History */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-100 rounded-xl text-gray-600 shadow-sm border border-gray-200">
                    <History className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-text">Recent History</h3>
                </div>
              </div>
              <div className="space-y-4">
                {HISTORY.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
                    <div>
                      <h4 className="text-sm font-bold text-text">{item.title}</h4>
                      <p className="text-xs text-muted font-medium mt-0.5">{item.date} • {item.duration}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 text-sm font-bold text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors">
                View Full Log
              </button>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Exercise;
