import { useState, useEffect } from 'react';
import { Timer, Brain, Award, ArrowRight, UserCheck, MessageSquare, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const QUESTIONS = [
  { text: "Can the child sort objects by shape and color?", category: "Conceptual" },
  { text: "Does the child share toys with others?", category: "Social" },
  { text: "Can the child wash and dry their hands independently?", category: "Practical" },
  { text: "Can the child follow two-step instructions? (e.g. 'Pick up the toy and put it in the box')", category: "Conceptual" },
  { text: "Does the child show empathy if someone is hurt?", category: "Social" }
];

const COLORS = ['#1A7F8E', '#F76C6C', '#A78BFA'];

const IQTest = () => {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let timer;
    if (started && !isFinished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [started, isFinished, timeLeft]);

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) setCurrentQ(q => q + 1);
    else setIsFinished(true);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!started) {
    return (
      <div className="max-w-4xl mx-auto py-12 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-3">
          <Brain className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-4xl font-heading font-black text-text mb-6">Scientific IQ Evaluation</h2>
        <p className="text-xl text-muted max-w-2xl mb-12 font-medium">
          A comprehensive 20-minute assessment covering conceptual, social, and practical life skills to accurately gauge cognitive development.
        </p>
        
        <div className="grid sm:grid-cols-3 gap-6 w-full max-w-3xl mb-12 text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <Zap className="h-8 w-8 text-secondary shrink-0" />
            <div><h4 className="font-bold">Conceptual</h4><p className="text-sm text-muted">Memory, learning, logic</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <MessageSquare className="h-8 w-8 text-primary shrink-0" />
            <div><h4 className="font-bold">Social</h4><p className="text-sm text-muted">Interaction, empathy</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <UserCheck className="h-8 w-8 text-accent shrink-0" />
            <div><h4 className="font-bold">Practical</h4><p className="text-sm text-muted">Daily living skills</p></div>
          </div>
        </div>

        <button 
          onClick={() => setStarted(true)}
          className="px-10 py-4 bg-primary text-white rounded-full font-extrabold text-lg shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all flex items-center gap-3"
        >
          Start 20-Min Assessment <ArrowRight className="h-6 w-6" />
        </button>
      </div>
    );
  }

  if (isFinished) {
    const pieData = [
      { name: 'Conceptual', value: 55 },
      { name: 'Social', value: 70 },
      { name: 'Practical', value: 45 },
    ];
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-in zoom-in-95 duration-700">
        <div className="bg-white rounded-[3rem] shadow-xl p-8 sm:p-12 border border-gray-100 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
          <div className="relative">
            <div className="w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black font-heading text-primary">58</span>
              <span className="text-sm font-bold text-muted">IQ Score</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary font-bold text-sm rounded-full mb-4">
              Mild Intellectual Disability
            </div>
            <h2 className="text-3xl font-heading font-black mb-4">Detailed Performance Report</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              Based on the assessment, the child shows strong social capabilities but requires targeted interventions in conceptual and practical skills. Early therapies can substantially bridge this gap.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all">
                Recommended Therapies
              </button>
              <button className="px-8 py-3 bg-white text-primary border-2 border-primary/20 rounded-full font-bold hover:bg-gray-50 transition-all">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="font-heading font-bold text-primary text-lg">{currentQ + 1}</span>
            <span className="text-primary/50 text-sm">/{QUESTIONS.length}</span>
          </div>
          <span className="font-bold text-muted px-3 py-1 bg-gray-100 rounded-lg text-sm">
            {QUESTIONS[currentQ].category} Section
          </span>
        </div>
        <div className="flex items-center gap-2 text-secondary font-bold bg-secondary/10 px-4 py-2 rounded-xl">
          <Timer className="h-5 w-5" />
          <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[2rem] shadow-xl p-8 sm:p-12 border border-gray-100 flex flex-col relative overflow-hidden">
        <div key={currentQ} className="flex-1 animate-in slide-in-from-right-16 fade-in duration-500">
          <h3 className="text-2xl sm:text-3xl font-heading font-black text-text mb-12">
            {QUESTIONS[currentQ].text}
          </h3>
          
          <div className="space-y-4">
            {['Proficient', 'Emerging', 'Not Yet', 'Unable to observe'].map((option, i) => (
              <button 
                key={i} 
                onClick={handleNext}
                className="w-full p-6 text-left rounded-2xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 hover:pl-8 transition-all font-bold text-lg text-text group flex justify-between items-center"
              >
                {option}
                <ArrowRight className="h-6 w-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-100 w-full">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${((currentQ) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IQTest;
