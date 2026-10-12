import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, Calendar, HeartPulse, BrainCircuit, Apple, 
  ArrowUpRight, Clock, Video, FileText, ChevronRight, Sparkles 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { childrenApi } from '../../features/onboarding/services/onboardingApi';

const progressData = [
  { month: 'Jan', speech: 45, cognitive: 38, behavioral: 60 },
  { month: 'Feb', speech: 48, cognitive: 42, behavioral: 62 },
  { month: 'Mar', speech: 55, cognitive: 50, behavioral: 68 },
  { month: 'Apr', speech: 58, cognitive: 54, behavioral: 72 },
  { month: 'May', speech: 62, cognitive: 60, behavioral: 75 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

const ParentDashboard = () => {
  const { currentUser } = useAuth();
  const [child, setChild] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchChild = async () => {
      try {
        const res = await childrenApi.getMyChildren();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setChild(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to load child in dashboard:', err);
      }
    };
    fetchChild();
    return () => { isMounted = false; };
  }, []);

  const childName = child?.preferredName || child?.firstName || 'your child';
  const parentGreeting = currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'Parent';

  return (
    <motion.div 
      className="space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-primary-100/40 to-secondary-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-10 -mb-16 w-48 h-48 rounded-full bg-gradient-to-tr from-accent-100/40 to-success-100/40 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full animate-pulse blur-sm opacity-50" />
              <img 
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(childName)}&backgroundColor=c0aede`} 
                alt={childName} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg relative z-10 bg-white"
              />
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md z-20">
                <div className="bg-success text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span>😊</span> Happy
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-text mb-1">
                Good morning, {parentGreeting}!
              </h2>
              <p className="text-muted font-medium mb-3">
                {childName} is having a great day. He reached <span className="text-primary font-bold">2 new milestones</span> this week.
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="bg-white border border-border/50 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm text-text">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  Development Score: 85/100
                </div>
                <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Next: Speech Therapy (Today, 2PM)
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Overall Progress', value: '82%', trend: '+5% this month', icon: BrainCircuit, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
          { label: 'Therapy Attended', value: '12/14', trend: 'Excellent consistency', icon: Calendar, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
          { label: 'Goals Completed', value: '8', trend: 'Out of 10 set goals', icon: Activity, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
          { label: 'Diet Compliance', value: '94%', trend: 'Target met!', icon: Apple, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5 }}
            className={`glass p-6 rounded-3xl border-t-[3px] ${stat.border} flex flex-col relative overflow-hidden group`}
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h4 className="text-sm font-bold text-muted">{stat.label}</h4>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="mt-auto relative z-10">
              <div className="flex items-end gap-2 mb-1">
                <span className="text-3xl font-heading font-black text-text">{stat.value}</span>
                <ArrowUpRight className={`w-5 h-5 mb-1 ${stat.color}`} />
              </div>
              <span className="text-xs font-semibold text-muted">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Progress Analytics Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass rounded-3xl p-6 sm:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-text">Development Analytics</h3>
              <p className="text-sm text-muted font-medium mt-1">Tracking Aarav's progress across core areas</p>
            </div>
            <button className="text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors flex items-center gap-1">
              Full Report <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="h-[300px] w-full text-sm font-medium">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpeech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCognitive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  labelStyle={{ fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}
                  itemStyle={{ fontWeight: '600' }}
                />
                <Area type="monotone" dataKey="speech" name="Speech" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorSpeech)" />
                <Area type="monotone" dataKey="cognitive" name="Cognitive" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorCognitive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right Column: Upcoming & Quick Actions */}
        <motion.div variants={itemVariants} className="space-y-6 lg:space-y-8">
          
          {/* Upcoming Activities */}
          <div className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <h3 className="font-heading font-extrabold text-lg mb-6 text-text">Upcoming Activities</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-2xl hover:bg-white/50 transition-colors border border-transparent hover:border-white shadow-sm">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                  <span className="text-[10px] font-extrabold leading-none uppercase tracking-wider">Today</span>
                  <span className="text-lg font-black leading-none mt-1">14</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-text truncate">Speech Therapy</h4>
                  <div className="flex items-center gap-1.5 text-xs text-muted font-medium mt-1">
                    <Clock className="w-3 h-3" /> 2:00 PM
                    <span className="w-1 h-1 rounded-full bg-border mx-1"></span>
                    <Video className="w-3 h-3" /> Dr. Emily
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 p-3 rounded-2xl hover:bg-white/50 transition-colors border border-transparent hover:border-white shadow-sm">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-secondary/10 flex flex-col items-center justify-center text-secondary">
                  <span className="text-[10px] font-extrabold leading-none uppercase tracking-wider">Tomw</span>
                  <span className="text-lg font-black leading-none mt-1">15</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-text truncate">Dietary Review</h4>
                  <div className="flex items-center gap-1.5 text-xs text-muted font-medium mt-1">
                    <Clock className="w-3 h-3" /> 10:30 AM
                    <span className="w-1 h-1 rounded-full bg-border mx-1"></span>
                    Clinic
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
              View Calendar <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link to="/assessment" className="bg-gradient-to-br from-primary to-blue-600 hover:from-primary hover:to-blue-700 text-white rounded-3xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-1 shadow-lg shadow-primary/25 group">
              <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Start<br/>Assessment</h4>
              </div>
            </Link>
            
            <Link to="/consultation" className="bg-gradient-to-br from-secondary to-teal-600 hover:from-secondary hover:to-teal-700 text-white rounded-3xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-1 shadow-lg shadow-secondary/25 group">
              <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Book<br/>Consultation</h4>
              </div>
            </Link>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default ParentDashboard;
