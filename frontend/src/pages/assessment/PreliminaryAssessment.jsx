import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, X, ShieldAlert, ArrowRight, Loader2, ArrowLeft, 
  MessageSquare, Brain, Eye, Ear, Activity, Clock, Bot,
  Heart, Sparkles, CheckCircle2, Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QUESTIONS = [
  {
    category: "Social Interaction",
    icon: MessageSquare,
    text: "Does your child respond to their name when called?",
    explanation: "Notice if they look up, turn towards you, or verbally acknowledge when you say their name in a normal tone.",
  },
  {
    category: "Social Interaction",
    icon: Heart,
    text: "Does your child show interest in other children?",
    explanation: "This includes watching other children play, trying to join in, or initiating interaction.",
  },
  {
    category: "Communication",
    icon: Eye,
    text: "Does your child make eye contact for more than a second or two?",
    explanation: "Observe if they meet your gaze during conversations or while playing together.",
  },
  {
    category: "Speech & Language",
    icon: Ear,
    text: "Are there any delays in their speech compared to siblings or peers?",
    explanation: "Consider their vocabulary size and ability to form short sentences compared to typical milestones.",
  },
  {
    category: "Motor Skills & Gestures",
    icon: Activity,
    text: "Does your child point to things they want?",
    explanation: "Using an index finger to point at objects out of reach to request them or draw your attention.",
  },
];

const ANSWER_OPTIONS = [
  { value: 'always', label: 'Always', desc: 'Consistent behavior', color: 'text-success', bg: 'bg-success/10', border: 'border-success' },
  { value: 'often', label: 'Often', desc: 'Most of the time', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary' },
  { value: 'sometimes', label: 'Sometimes', desc: 'Occasionally happens', color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent' },
  { value: 'never', label: 'Never', desc: 'Rarely or never', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary' },
];

const PreliminaryAssessment = ({ isOnboarding = false, onComplete, onBack, initialAnswers, onAnswersChange }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Sync state upward if needed
  React.useEffect(() => {
    if (onAnswersChange) {
      onAnswersChange(answers);
    }
  }, [answers, onAnswersChange]);

  const handleAnswer = (val) => {
    setAnswers({ ...answers, [currentQ]: val });
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      submitAssessment();
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(q => q - 1);
    } else if (isOnboarding && onBack) {
      onBack();
    }
  };

  const submitAssessment = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentQ(QUESTIONS.length);
    }, 2000);
  };

  if (currentQ === QUESTIONS.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-12 text-center"
      >
        <div className="glass p-12 rounded-[2rem] border border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-success-100/50 to-primary-100/50 blur-3xl" />
          
          <div className="w-24 h-24 bg-gradient-to-br from-success to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-success/30 relative z-10">
            <Check className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-text mb-4 relative z-10">Assessment Complete!</h2>
          <p className="text-muted text-lg mb-8 relative z-10">Thank you. Based on your child's preliminary assessment, we recommend a complete evaluation for detailed insights.</p>
          
          <div className="bg-white/80 p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
             <div className="flex items-center gap-4 text-left">
               <div className="bg-primary/10 p-4 rounded-2xl">
                 <Brain className="h-8 w-8 text-primary" />
               </div>
               <div>
                 <h4 className="font-bold text-text text-lg">
                   {isOnboarding ? "Next Step: Review & Confirmation" : "Next Step: Scientific IQ Test"}
                 </h4>
                 <p className="text-sm text-muted">
                   {isOnboarding ? "Review your details to complete setup" : "20 minute interactive evaluation"}
                 </p>
               </div>
             </div>
             <button 
               onClick={() => isOnboarding && onComplete ? onComplete() : navigate('/iq-test')} 
               className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
             >
               {isOnboarding ? "Continue to Review" : "Start Test"} <ArrowRight className="w-5 h-5" />
             </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = QUESTIONS[currentQ];
  const progressPercent = Math.round((currentQ / QUESTIONS.length) * 100);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top Header Section */}
      {!isOnboarding && (
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass p-6 rounded-3xl border border-white">
        <div className="flex items-center gap-4">
          <img 
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Child&backgroundColor=c0aede" 
            alt="Child" 
            className="w-14 h-14 rounded-full border-2 border-white shadow-sm bg-white"
          />
          <div>
            <h1 className="text-xl font-heading font-extrabold text-text">Preliminary Assessment</h1>
            <p className="text-sm text-muted font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Est. 5 mins left
            </p>
          </div>
        </div>
        
        <div className="w-full md:w-64">
          <div className="flex justify-between text-sm font-bold text-text mb-2">
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
      </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Question Area */}
        <div className="flex-1">
          <div className="glass rounded-[2.5rem] shadow-sm border border-white p-8 md:p-12 min-h-[500px] flex flex-col relative overflow-hidden">
            {isSubmitting ? (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="flex flex-col items-center justify-center h-full space-y-6 my-auto"
               >
                 <div className="relative">
                   <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                   <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
                 </div>
                 <p className="font-bold text-text text-xl animate-pulse">Analyzing responses...</p>
               </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentQ}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full"
                >
                  <div className="mb-8 inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-xl text-sm font-bold border border-primary/10 w-fit">
                    <currentQuestion.icon className="w-4 h-4" />
                    {currentQuestion.category}
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-heading font-extrabold text-text mb-4 leading-tight">
                    {currentQuestion.text}
                  </h3>
                  <p className="text-muted text-lg mb-10 leading-relaxed max-w-2xl">
                    {currentQuestion.explanation}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                    {ANSWER_OPTIONS.map((option) => {
                      const isSelected = answers[currentQ] === option.value;
                      return (
                        <button 
                          key={option.value}
                          type="button"
                          onClick={() => handleAnswer(option.value)}
                          className={`group p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 text-left relative overflow-hidden ${
                            isSelected 
                              ? 'border-indigo-600 bg-indigo-50/70 shadow-md shadow-indigo-500/10' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/60 bg-white'
                          }`}
                        >
                          <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            isSelected ? 'text-indigo-600' : 'text-gray-300 group-hover:text-gray-400'
                          }`}>
                            {isSelected ? <CheckCircle2 className="w-6 h-6 text-indigo-600 fill-indigo-100" /> : <Circle className="w-6 h-6" />}
                          </div>
                          <div className="relative z-10 min-w-0">
                            <span className={`block font-extrabold text-lg mb-0.5 ${
                              isSelected ? 'text-indigo-900' : 'text-gray-900'
                            }`}>
                              {option.label}
                            </span>
                            <span className={`block text-xs font-medium ${
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
            )}
            
            {/* Bottom Navigation */}
            {!isSubmitting && (
              <div className="mt-12 pt-6 border-t border-border/40 flex items-center justify-between">
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
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                      !answers[currentQ] 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-primary text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:bg-primary/90'
                    }`}
                  >
                    {currentQ === QUESTIONS.length - 1 ? 'Finish' : 'Next'} <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
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
                <h4 className="font-bold text-text mb-1">You're doing great!</h4>
                <p className="text-sm text-muted">Answering honestly helps us provide the best support plan for your child.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Bot className="w-24 h-24 text-indigo-500" />
             </div>
             <h4 className="font-bold text-indigo-900 mb-2 relative z-10">Need clarification?</h4>
             <p className="text-sm text-indigo-700/80 mb-4 relative z-10">Our AI assistant can help explain any question in more detail.</p>
             <button className="w-full py-2.5 bg-white text-indigo-600 font-bold rounded-xl text-sm shadow-sm hover:shadow transition-all relative z-10 flex items-center justify-center gap-2">
               <Bot className="w-4 h-4" /> Ask AI Assistant
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PreliminaryAssessment;
