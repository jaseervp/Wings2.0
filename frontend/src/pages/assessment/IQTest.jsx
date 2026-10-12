import { useState, useEffect } from 'react';
import { 
  Timer, Brain, Award, ArrowRight, ArrowLeft, UserCheck, MessageSquare, Zap, 
  Calendar, Clock, Target, FileText, ShieldCheck, HeartHandshake, TrendingUp,
  LineChart as LineChartIcon, Bot, CheckCircle2, Circle, Sparkles
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { childrenApi } from '../../features/onboarding/services/onboardingApi';

const QUESTIONS = [
  { 
    text: "Can the child sort objects by shape and color?", 
    category: "Conceptual",
    icon: Zap,
    explanation: "Observe if they can group items like red blocks together, and separate them from blue blocks or round toys."
  },
  { 
    text: "Does the child share toys with others?", 
    category: "Social",
    icon: MessageSquare,
    explanation: "Notice if they are willing to take turns or offer a toy to a sibling or friend without extreme distress."
  },
  { 
    text: "Can the child wash and dry their hands independently?", 
    category: "Practical",
    icon: UserCheck,
    explanation: "This includes turning on the tap, using soap, rinsing, and using a towel without your physical guidance."
  },
  { 
    text: "Can the child follow two-step instructions?", 
    category: "Conceptual",
    icon: Zap,
    explanation: "For example: 'Pick up the toy and put it in the box' or 'Get your shoes and bring them here'."
  },
  { 
    text: "Does the child show empathy if someone is hurt?", 
    category: "Social",
    icon: MessageSquare,
    explanation: "Do they look concerned, pat the person, or try to comfort them when they see someone crying?"
  }
];

const ANSWER_OPTIONS = [
  { value: 'proficient', label: 'Proficient', desc: 'Performs skill consistently', color: 'text-success', bg: 'bg-success/10', border: 'border-success' },
  { value: 'emerging', label: 'Emerging', desc: 'Sometimes or needs help', color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent' },
  { value: 'not_yet', label: 'Not Yet', desc: 'Rarely or cannot perform', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary' },
];

const COLORS = ['#1A7F8E', '#F76C6C', '#A78BFA'];

const progressData = [
  { month: 'Jan', score: 45 },
  { month: 'Feb', score: 48 },
  { month: 'Mar', score: 55 },
  { month: 'Apr', score: 58 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const IQTest = () => {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState({});
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
        console.error('Failed to load child in IQ test:', err);
      }
    };
    fetchChild();
    return () => { isMounted = false; };
  }, []);

  const childName = child?.preferredName || child?.firstName || 'the child';

  useEffect(() => {
    let timer;
    if (started && !isFinished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [started, isFinished, timeLeft]);

  const handleAnswer = (val) => {
    setAnswers({ ...answers, [currentQ]: val });
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(q => q - 1);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!started) {
// ... landing page remains exactly the same as previously implemented ...
    return (
      <div className="max-w-6xl mx-auto py-8 lg:py-12 px-4 sm:px-6">
        <motion.div 
          className="space-y-8 sm:space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 1. Hero Section & Progress Overview (Top Grid) */}
          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="lg:col-span-3 glass rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-center border border-white">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-primary-100/60 to-secondary-100/60 blur-3xl" />
              
              <div className="relative z-10 flex items-center gap-4 mb-8">
                <img 
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Aarav&backgroundColor=c0aede" 
                  alt="Aarav" 
                  className="w-16 h-16 rounded-full border-4 border-white shadow-md bg-white"
                />
                <div>
                  <h3 className="font-bold text-text">Aarav's Assessment</h3>
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Last: 3 mos ago</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 15 Mins</span>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold mb-4">
                  <Brain className="w-4 h-4" /> Comprehensive IQ Evaluation
                </div>
                <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-text mb-4 leading-tight">
                  Track Cognitive <br/>Development
                </h1>
                <p className="text-muted text-lg font-medium max-w-xl leading-relaxed">
                  A supportive, scientifically-backed assessment designed specifically for early childhood development. Help us understand Aarav's unique learning style and cognitive growth.
                </p>
              </div>
            </motion.div>

            {/* Progress Overview */}
            <motion.div variants={itemVariants} className="lg:col-span-2 glass rounded-3xl p-8 border-t-[4px] border-t-primary flex flex-col border border-white">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-heading font-bold text-xl text-text">Progress Trend</h3>
                  <p className="text-sm text-muted">Based on previous assessments</p>
                </div>
                <div className="bg-success/10 text-success px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> +8%
                </div>
              </div>
              
              <div className="flex items-end gap-3 mb-6">
                <span className="text-5xl font-black font-heading text-text">58</span>
                <span className="text-sm font-bold text-muted mb-2">Previous Score</span>
              </div>
              
              <div className="h-40 w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0F172A' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* 2. Development Areas */}
          <motion.div variants={itemVariants}>
            <h3 className="font-heading font-extrabold text-2xl text-text mb-6">Key Development Areas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { title: 'Cognitive Skills', desc: 'Memory, learning & logic', icon: Brain, color: 'text-primary', bg: 'bg-primary/10' },
                { title: 'Social Dev.', desc: 'Interaction & empathy', icon: MessageSquare, color: 'text-secondary', bg: 'bg-secondary/10' },
                { title: 'Attention & Focus', desc: 'Task engagement', icon: Target, color: 'text-accent', bg: 'bg-accent/10' },
                { title: 'Daily Living', desc: 'Practical life skills', icon: UserCheck, color: 'text-success', bg: 'bg-success/10' },
              ].map((area, i) => (
                <div key={i} className="glass p-6 rounded-2xl hover:-translate-y-1 transition-transform group cursor-pointer border border-white">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${area.bg} ${area.color} group-hover:scale-110 transition-transform`}>
                    <area.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-text mb-1">{area.title}</h4>
                  <p className="text-sm text-muted font-medium">{area.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 4 & 6. Benefits & CTA Section */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-8">
            <div className="glass rounded-3xl p-8 sm:p-10 border border-white">
              <h3 className="font-heading font-extrabold text-2xl text-text mb-6">Assessment Benefits</h3>
              <div className="space-y-6">
                {[
                  { title: 'Personalized Recommendations', icon: FileText, color: 'text-primary' },
                  { title: 'Therapist Insights & Review', icon: HeartHandshake, color: 'text-secondary' },
                  { title: 'Detailed Progress Tracking', icon: LineChartIcon, color: 'text-accent' },
                  { title: 'Clear Development Roadmap', icon: Target, color: 'text-success' },
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`p-3 rounded-full bg-gray-50 ${benefit.color} border border-border/50 shadow-sm`}>
                      <benefit.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-text">{benefit.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden flex flex-col justify-center items-center text-center shadow-xl shadow-primary/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />
              
              <div className="relative z-10 w-full max-w-sm mx-auto">
                <Brain className="w-16 h-16 text-white/90 mx-auto mb-6" />
                <h3 className="font-heading font-extrabold text-3xl mb-2">Ready to begin?</h3>
                <p className="text-blue-100 mb-8 font-medium">Create a comfortable, distraction-free environment for {childName} before starting.</p>
                
                <button 
                  onClick={() => setStarted(true)}
                  className="w-full py-4 bg-white text-primary rounded-2xl font-extrabold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                >
                  Start Assessment <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center justify-center gap-4 mt-6 text-sm font-bold text-blue-100">
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> 15 Questions</span>
                  <span className="w-1 h-1 rounded-full bg-blue-300" />
                  <span className="flex items-center gap-1"><Timer className="w-4 h-4" /> 15 Minutes</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 5. Trust Indicators */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 sm:gap-12 pt-4">
            {[
              { label: 'Evidence-Based', icon: Award },
              { label: 'Therapist Reviewed', icon: UserCheck },
              { label: 'Child-Safe', icon: HeartHandshake },
              { label: 'Secure Data', icon: ShieldCheck },
            ].map((indicator, i) => (
              <div key={i} className="flex items-center gap-2 text-muted font-bold text-sm">
                <indicator.icon className="w-5 h-5 text-gray-400" /> {indicator.label}
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    );
  }

  if (isFinished) {
    const radarData = [
      { subject: 'Cognitive', A: 85, fullMark: 100 },
      { subject: 'Social', A: 70, fullMark: 100 },
      { subject: 'Practical', A: 60, fullMark: 100 },
      { subject: 'Attention', A: 50, fullMark: 100 },
      { subject: 'Motor', A: 90, fullMark: 100 },
    ];

    const historicalData = [
      { month: 'Jan', score: 45 },
      { month: 'Mar', score: 50 },
      { month: 'May', score: 58 },
      { month: 'Current', score: 65 },
    ];

    return (
      <div className="max-w-6xl mx-auto space-y-8 py-8 lg:py-12 px-4 sm:px-6">
        <motion.div 
          className="space-y-8 sm:space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 1. Hero Section & AI Insights */}
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="lg:col-span-2 glass rounded-[2.5rem] p-8 sm:p-12 border border-white relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-100/50 to-success-100/30 rounded-full blur-3xl -mr-20 -mt-20" />
              
              <div className="relative z-10 shrink-0">
                <div className="w-40 h-40 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[{value: 65}, {value: 35}]} innerRadius={65} outerRadius={80} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                        <Cell fill="#2563EB" />
                        <Cell fill="#E2E8F0" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black font-heading text-primary">65</span>
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Score</span>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 text-secondary border border-secondary/20 font-bold text-sm rounded-full mb-4 shadow-sm">
                  <HeartHandshake className="w-4 h-4" /> Mild Intellectual Disability
                </div>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-text mb-4 leading-tight">
                  Aarav's Assessment Report
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-semibold text-muted">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> June 19, 2026</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-border" />
                  <span className="flex items-center gap-1.5 text-success"><TrendingUp className="w-4 h-4" /> +7 Points since last test</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 border border-white bg-gradient-to-br from-indigo-50/80 to-purple-50/80 relative overflow-hidden flex flex-col">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Bot className="w-48 h-48 text-indigo-600" />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm border border-indigo-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-xl text-indigo-900">AI Insights</h3>
              </div>
              <p className="text-indigo-900/80 font-medium leading-relaxed relative z-10 mb-6">
                Aarav is showing fantastic progress in his motor skills and conceptual understanding! His social interactions are emerging nicely, though attention during structured tasks remains a key area for our focused support.
              </p>
              <button className="mt-auto relative z-10 w-full py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-sm hover:shadow transition-all border border-indigo-100 flex items-center justify-center gap-2">
                Ask AI about this report <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>

          {/* 2 & 8. Development Overview & Progress Tracking */}
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 sm:p-10 border border-white flex flex-col">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h3 className="font-heading font-extrabold text-2xl text-text">Skill Breakdown</h3>
                  <p className="text-sm text-muted">Multi-dimensional developmental profile</p>
                </div>
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Target className="w-6 h-6" />
                </div>
              </div>
              
              <div className="flex-1 flex items-center justify-center -my-8">
                <div className="w-full h-80 sm:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Aarav" dataKey="A" stroke="#2563EB" strokeWidth={3} fill="#2563EB" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 sm:p-10 border border-white flex flex-col">
              <div className="mb-8 flex justify-between items-start">
                <div>
                  <h3 className="font-heading font-extrabold text-2xl text-text">Historical Growth</h3>
                  <p className="text-sm text-muted">Tracking progress over time</p>
                </div>
                <div className="p-3 bg-success/10 text-success rounded-xl">
                  <LineChartIcon className="w-6 h-6" />
                </div>
              </div>
              
              <div className="flex-1 min-h-[250px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 13, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 13, fontWeight: 600 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0F172A' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#22C55E" strokeWidth={4} fillOpacity={1} fill="url(#colorGrowth)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* 3 & 4. Strengths and Improvements */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 border-t-[6px] border-success relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <Award className="w-8 h-8 text-success" />
                <h3 className="font-heading font-extrabold text-2xl text-text">Key Strengths</h3>
              </div>
              <ul className="space-y-4 relative z-10">
                {[
                  "Excellent visual-spatial matching",
                  "Strong empathetic responses to peers",
                  "High proficiency in fine motor tasks",
                  "Remembers familiar routines perfectly"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-border/50 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span className="font-semibold text-text">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 border-t-[6px] border-accent relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <Target className="w-8 h-8 text-accent" />
                <h3 className="font-heading font-extrabold text-2xl text-text">Focus Areas</h3>
              </div>
              <ul className="space-y-4 relative z-10">
                {[
                  "Following complex, multi-step directions",
                  "Sustaining attention during seated tasks",
                  "Expressive language and vocabulary expansion",
                  "Independent problem-solving in new scenarios"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-border/50 shadow-sm">
                    <Circle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="font-semibold text-text">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* 6. Recommended Therapies */}
          <motion.div variants={itemVariants}>
            <h3 className="font-heading font-extrabold text-3xl text-text mb-6">Recommended Therapies</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Speech Therapy', desc: 'Focus on expressive language and vocabulary expansion. 2x weekly.', icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/10' },
                { title: 'Occupational Therapy', desc: 'Enhance daily living skills and sensory processing. 1x weekly.', icon: UserCheck, color: 'text-secondary', bg: 'bg-secondary/10' },
                { title: 'Behavioral Support', desc: 'Strategies for sustaining attention and task completion.', icon: Brain, color: 'text-accent', bg: 'bg-accent/10' },
              ].map((therapy, i) => (
                <div key={i} className="glass p-6 rounded-[2rem] border border-white hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${therapy.bg} ${therapy.color} group-hover:-translate-y-1 transition-transform`}>
                    <therapy.icon className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-lg text-text mb-2">{therapy.title}</h4>
                  <p className="text-sm text-muted font-medium leading-relaxed">{therapy.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 9. Next Actions CTA */}
          <motion.div variants={itemVariants} className="mt-12 bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h3 className="font-heading font-extrabold text-3xl text-text mb-2">Next Steps</h3>
              <p className="text-muted text-lg font-medium">Review this report with your lead therapist to adjust Aarav's care plan.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button className="px-8 py-4 bg-white text-primary border-2 border-primary/20 rounded-2xl font-extrabold hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" /> Download PDF
              </button>
              <button className="px-8 py-4 bg-primary text-white rounded-2xl font-extrabold shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Schedule Consultation <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

        </motion.div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentQ];
  const progressPercent = Math.round(((currentQ) / QUESTIONS.length) * 100);

  return (
    <div className="max-w-6xl mx-auto w-full h-[calc(100vh-100px)] flex flex-col py-6 px-4">
      
      {/* Top Header Section */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass p-6 rounded-3xl border border-white">
        <div className="flex items-center gap-4">
          <img 
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Aarav&backgroundColor=c0aede" 
            alt="Aarav" 
            className="w-14 h-14 rounded-full border-2 border-white shadow-sm bg-white"
          />
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-heading font-extrabold text-text">IQ Assessment</h1>
              <span className="font-bold text-primary px-3 py-0.5 bg-primary/10 border border-primary/20 rounded-lg text-xs shadow-sm flex items-center gap-1.5">
                <currentQuestion.icon className="w-3.5 h-3.5" />
                {currentQuestion.category}
              </span>
            </div>
            <p className="text-sm text-muted font-medium flex items-center gap-1.5">
              Question {currentQ + 1} of {QUESTIONS.length}
            </p>
          </div>
        </div>
        
        <div className="w-full md:w-72 flex items-center gap-6">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold text-text mb-2">
              <span>Progress</span>
              <span className="text-primary">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                initial={{ width: `${((currentQ) / QUESTIONS.length) * 100}%` }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-secondary font-bold bg-secondary/10 px-4 py-3 rounded-xl border border-secondary/20 whitespace-nowrap">
            <Timer className="h-5 w-5" />
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* Main Question Area */}
        <div className="flex-1 flex flex-col">
          <div className="glass rounded-[2.5rem] shadow-sm border border-white p-8 md:p-12 flex-1 flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                <h3 className="text-3xl md:text-4xl font-heading font-extrabold text-text mb-4 leading-tight">
                  {currentQuestion.text}
                </h3>
                <p className="text-muted text-lg mb-10 leading-relaxed max-w-2xl bg-gray-50/50 p-4 rounded-xl border border-border/50">
                  <strong className="text-text">Therapist note:</strong> {currentQuestion.explanation}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-auto">
                  {ANSWER_OPTIONS.map((option) => {
                    const isSelected = answers[currentQ] === option.value;
                    return (
                      <button 
                        key={option.value}
                        type="button"
                        onClick={() => handleAnswer(option.value)}
                        className={`group p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-4 text-center relative overflow-hidden ${
                          isSelected 
                            ? 'border-indigo-600 bg-indigo-50/70 shadow-md shadow-indigo-500/10 scale-[1.02]' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/60 bg-white'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors bg-white shadow-sm border ${
                          isSelected ? 'text-indigo-600 border-indigo-200' : 'text-gray-300 border-gray-100 group-hover:text-gray-400'
                        }`}>
                          {isSelected ? <CheckCircle2 className="w-7 h-7 text-indigo-600 fill-indigo-100" /> : <Circle className="w-7 h-7" />}
                        </div>
                        <div className="relative z-10 min-w-0">
                          <span className={`block font-extrabold text-xl mb-1 ${
                            isSelected ? 'text-indigo-900' : 'text-gray-900'
                          }`}>
                            {option.label}
                          </span>
                          <span className={`block text-sm font-medium ${
                            isSelected ? 'text-indigo-700' : 'text-gray-500'
                          }`}>
                            {option.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Bottom Navigation */}
            <div className="mt-10 pt-6 border-t border-border/40 flex items-center justify-between">
              <button 
                onClick={handlePrev}
                disabled={currentQ === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                  currentQ === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-muted hover:bg-gray-100 hover:text-text'
                }`}
              >
                <ArrowLeft className="w-5 h-5" /> Previous
              </button>
              
              <div className="flex items-center gap-4">
                <button className="text-sm font-semibold text-muted hover:text-text transition-colors hidden sm:block">
                  Save & continue later
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!answers[currentQ]}
                  className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all ${
                    !answers[currentQ] 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-primary text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:bg-primary/90'
                  }`}
                >
                  {currentQ === QUESTIONS.length - 1 ? 'Finish Assessment' : 'Next Question'} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Support Side Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="glass p-6 rounded-3xl border border-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-secondary/10 rounded-xl">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-bold text-text mb-1">Observation Tip</h4>
                <p className="text-sm text-muted leading-relaxed">Don't prompt {childName} immediately. Give them 5 seconds to respond independently before providing assistance.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-3xl border border-primary/10 relative overflow-hidden flex-1 flex flex-col">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <Bot className="w-32 h-32 text-primary" />
             </div>
             <h4 className="font-bold text-primary mb-2 relative z-10 flex items-center gap-2">
               <Bot className="w-5 h-5" /> Ask AI Clinical Assistant
             </h4>
             <p className="text-sm text-muted mb-6 relative z-10">Unsure how to score this behavior? Ask our AI assistant for specific behavioral examples.</p>
             
             <div className="mt-auto space-y-3 relative z-10">
                <button className="w-full p-3 bg-white text-left text-sm text-text font-semibold rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all">
                  "What does emerging look like?"
                </button>
                <button className="w-full p-3 bg-white text-left text-sm text-text font-semibold rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all">
                  "Does physical prompting count?"
                </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IQTest;
