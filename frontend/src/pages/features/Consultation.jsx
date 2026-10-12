import { useState } from 'react';
import { 
  Calendar, Clock, Video, Star, MapPin, ChevronRight, CheckCircle2,
  Users, Activity, MessageSquare, Bot, Languages, HeartPulse, BrainCircuit,
  Baby, History, FileText, Download
} from 'lucide-react';
import { motion } from 'framer-motion';

const DOCTORS = [
  { id: 1, name: 'Dr. Sarah Philip', spec: 'Child Psychologist', rating: 4.9, reviews: 124, exp: '12 Years', type: 'Video & In-Person', langs: 'English, Hindi', fee: '$80/session', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200' },
  { id: 2, name: 'Dr. Rajiv Menon', spec: 'Speech Therapist', rating: 4.8, reviews: 89, exp: '8 Years', type: 'Video', langs: 'English, Tamil', fee: '$60/session', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200' },
  { id: 3, name: 'Dr. Anita Desai', spec: 'Occupational Therapist', rating: 4.9, reviews: 210, exp: '15 Years', type: 'In-Person', langs: 'English, Kannada', fee: '$90/session', img: 'https://images.unsplash.com/photo-1594824436998-d8abc63b8655?auto=format&fit=crop&q=80&w=200' },
  { id: 4, name: 'Dr. Michael Chen', spec: 'Pediatric Physiotherapist', rating: 4.7, reviews: 156, exp: '10 Years', type: 'Video & In-Person', langs: 'English, Mandarin', fee: '$85/session', img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200' }
];

const CATEGORIES = [
  { name: 'All Specialists', icon: Users, active: true },
  { name: 'Speech Therapy', icon: MessageSquare, active: false },
  { name: 'Psychology', icon: BrainCircuit, active: false },
  { name: 'Occupational', icon: Activity, active: false },
  { name: 'Physiotherapy', icon: HeartPulse, active: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const Consultation = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-6">
      
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading font-extrabold text-primary mb-2">Care Network</h2>
          <p className="text-muted font-medium">Connect with Aarav's dedicated specialists</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* 1. Child Care Hero Section */}
        <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 sm:p-10 border border-white bg-gradient-to-br from-blue-700 to-primary text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -ml-20 -mb-20" />
          
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-white/30 p-1">
              <img 
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Aarav&backgroundColor=ffffff" 
                alt="Aarav" 
                className="w-full h-full rounded-full shadow-lg bg-white"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-bold mb-3 shadow-sm">
                <Baby className="w-4 h-4" /> Core Focus: Communication
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold mb-1">Aarav's Care Plan</h2>
              <p className="text-blue-100 font-medium">Progressing well with speech therapy modules.</p>
            </div>
          </div>
          
          <div className="relative z-10 flex gap-4 w-full md:w-auto">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[140px]">
              <span className="text-sm font-bold opacity-90 uppercase tracking-wider mb-1">Next Appt</span>
              <span className="text-2xl font-heading font-black leading-tight drop-shadow-md">May 16</span>
              <span className="text-xs text-blue-100 font-semibold mt-1">Dr. Rajiv Menon</span>
            </div>
          </div>
        </motion.div>

        <div className="grid xl:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* 2. Upcoming Appointment */}
            <motion.div variants={itemVariants} className="glass bg-white rounded-[2.5rem] p-6 sm:p-8 border border-white shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Video className="h-40 w-40 text-primary" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-text mb-6 relative z-10">Upcoming Appointment</h3>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                <div className="flex-shrink-0 w-24 h-24 rounded-full bg-secondary/10 flex flex-col items-center justify-center text-secondary border-4 border-white shadow-md">
                  <span className="text-xs font-bold leading-none mb-1">MAY</span>
                  <span className="text-3xl font-black leading-none">16</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold bg-secondary/10 text-secondary px-3 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5"/> 10:00 AM
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-md">
                      <Video className="w-3.5 h-3.5"/> Video Session
                    </span>
                  </div>
                  <h4 className="text-2xl font-heading font-black text-text mb-1">Speech Therapy Review</h4>
                  <div className="flex items-center gap-3">
                    <img src={DOCTORS[1].img} alt="" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                    <p className="text-muted font-bold text-sm">Dr. Rajiv Menon</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <button className="px-8 py-3.5 bg-secondary text-white rounded-xl font-bold shadow-lg shadow-secondary/30 hover:shadow-secondary/40 hover:-translate-y-0.5 transition-all text-center">
                    Join Session
                  </button>
                  <button className="px-8 py-3.5 bg-gray-50 text-text border border-gray-200 rounded-xl font-bold hover:bg-gray-100 transition-all text-center">
                    Reschedule
                  </button>
                </div>
              </div>
            </motion.div>

            {/* 4. Specialist Categories */}
            <motion.div variants={itemVariants}>
              <h3 className="font-heading font-extrabold text-2xl text-text mb-6">Directory</h3>
              <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
                {CATEGORIES.map((cat, i) => (
                  <button 
                    key={i} 
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${cat.active ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-white text-muted border-gray-200 hover:border-primary/50'}`}
                  >
                    <cat.icon className="w-4 h-4" /> {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 5. Specialist Directory */}
            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-6">
              {DOCTORS.map(doc => (
                <div key={doc.id} className="glass bg-white rounded-[2rem] p-6 shadow-sm border border-white hover:shadow-xl hover:border-primary/20 transition-all group flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none" />
                  
                  <div className="flex items-start gap-4 mb-5 relative z-10">
                    <img src={doc.img} alt={doc.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm border-4 border-white bg-white" />
                    <div>
                      <h4 className="font-bold text-lg text-text group-hover:text-primary transition-colors leading-tight mb-1">{doc.name}</h4>
                      <p className="text-xs text-primary font-bold bg-primary/5 border border-primary/10 inline-block px-2 py-1 rounded-md mb-2">{doc.spec}</p>
                      <div className="flex items-center gap-1 text-xs text-muted font-bold">
                        <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                        <span className="text-text">{doc.rating}</span>
                        <span>({doc.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6 relative z-10 flex-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <Activity className="w-4 h-4 text-secondary" /> {doc.exp}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <Languages className="w-4 h-4 text-primary" /> {doc.langs}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 relative z-10">
                    <div className="text-sm font-black text-text">{doc.fee}</div>
                    <button 
                      onClick={() => setSelectedDoc(doc)}
                      className="px-5 py-2.5 bg-gray-50 text-text font-bold text-sm rounded-xl border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2"
                    >
                      Book <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-8">
            
            {/* 3. AI Specialist Recommendation */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <Bot className="w-40 h-40 text-indigo-600" />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm border border-indigo-200">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-indigo-900">AI Care Insight</h3>
              </div>
              <p className="text-sm text-indigo-900/80 font-medium leading-relaxed relative z-10 mb-4">
                Based on Aarav's recent gross motor assessments, scheduling a review with a Pediatric Physiotherapist like Dr. Michael Chen is highly recommended.
              </p>
              <button className="w-full py-2.5 text-sm font-bold text-indigo-600 bg-white/60 border border-indigo-200 rounded-xl hover:bg-white transition-colors relative z-10">
                View Recommendations
              </button>
            </motion.div>

            {/* 6. Care Team Overview */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm border border-primary/20">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-text">Aarav's Care Team</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Dr. Rajiv Menon', role: 'Speech Therapist', status: 'Active' },
                  { name: 'Dr. Sarah Philip', role: 'Child Psychologist', status: 'Reviewing' }
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <h4 className="text-sm font-bold text-text">{member.name}</h4>
                      <p className="text-xs text-muted font-medium mt-0.5">{member.role}</p>
                    </div>
                    <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-md">{member.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 7. Therapist Notes */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-accent/10 rounded-xl text-accent shadow-sm border border-accent/20">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-text">Latest Notes</h3>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 relative">
                <p className="text-sm text-muted font-medium italic">
                  "Aarav's vocabulary expanded by 5 words this week. Continue the daily object identification exercises at home."
                </p>
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-xs font-bold">
                  <span className="text-text">Dr. Rajiv Menon</span>
                  <span className="text-muted">2 days ago</span>
                </div>
              </div>
            </motion.div>

            {/* 8. Consultation History */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary shadow-sm border border-secondary/20">
                  <History className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-text">Past Sessions</h3>
              </div>
              <div className="space-y-4">
                {[
                  { date: 'Apr 28, 2026', title: 'Psychology Eval', doc: 'Dr. Sarah Philip' },
                  { date: 'Apr 14, 2026', title: 'Speech Therapy', doc: 'Dr. Rajiv Menon' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
                    <div>
                      <h4 className="text-sm font-bold text-text group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-xs text-muted font-medium mt-0.5">{item.date} • {item.doc}</p>
                    </div>
                    <Download className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>

      {/* Booking Modal Overlay */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-text/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={(e) => { if (e.target === e.currentTarget) setSelectedDoc(null) }}>
          <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-heading font-black text-primary">Book Session</h3>
                <p className="text-muted font-bold mt-1 text-sm">{selectedDoc.name} - {selectedDoc.spec}</p>
              </div>
              <img src={selectedDoc.img} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-100 shadow-sm" />
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-text mb-2 block">Select Date & Time</label>
                <div className="flex gap-3">
                  <input type="date" className="flex-1 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-sm" />
                  <input type="time" className="flex-1 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-sm" />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-text mb-2 block">Consultation Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="border-2 border-primary bg-primary/5 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer text-primary font-bold transition-all shadow-sm">
                    <input type="radio" name="format" className="hidden" defaultChecked />
                    <Video className="w-5 h-5" /> Video Call
                  </label>
                  <label className="border-2 border-gray-100 bg-gray-50 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer text-muted font-bold hover:border-primary/50 transition-all">
                    <input type="radio" name="format" className="hidden" />
                    <MapPin className="w-5 h-5" /> In-person
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-text mb-2 block">Notes to Specialist (Optional)</label>
                <textarea rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm resize-none" placeholder="Briefly describe what you'd like to discuss..."></textarea>
              </div>
              
              <div className="flex gap-3 pt-4 mt-2 border-t border-gray-100">
                <button onClick={() => setSelectedDoc(null)} className="flex-1 py-4 text-text font-bold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={() => setSelectedDoc(null)} className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 flex justify-center items-center gap-2 shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5">
                  <CheckCircle2 className="w-5 h-5" /> Confirm & Pay {selectedDoc.fee.split('/')[0]}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultation;
