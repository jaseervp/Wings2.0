import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

const QUESTIONS = [
  "Does your child respond to their name when called?",
  "Does your child show interest in other children?",
  "Does your child make eye contact for more than a second or two?",
  "Are there any delays in their speech compared to siblings or peers?",
  "Does your child point to things they want?",
];

const PreliminaryAssessment = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (val) => {
    setAnswers({ ...answers, [currentQ]: val });
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 300);
    } else {
      submitAssessment();
    }
  };

  const submitAssessment = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/assessment-result'); 
      // For now we'll just show the result via state instead of a new route 
      // Actually we will handle it locally for this demo
      setCurrentQ(QUESTIONS.length);
    }, 1500);
  };

  if (currentQ === QUESTIONS.length) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-success/10 text-success rounded-[2rem] flex items-center justify-center mx-auto mb-6">
          <Check className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-heading font-extrabold text-primary mb-4">Assessment Complete</h2>
        <p className="text-muted text-lg mb-8">Thank you. Based on the preliminary assessment, we recommend a complete IQ evaluation for detailed insights.</p>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4 text-left">
             <div className="bg-primary/10 p-3 rounded-xl">
               <ShieldAlert className="h-6 w-6 text-primary" />
             </div>
             <div>
               <h4 className="font-bold text-text">Next Step: Scientific IQ Test</h4>
               <p className="text-sm text-muted">20 minute interactive evaluation</p>
             </div>
           </div>
           <button onClick={() => navigate('/iq-test')} className="px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
             Start IQ Test
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-12">
        <div className="flex justify-between text-sm font-bold text-muted mb-2">
          <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(((currentQ) / QUESTIONS.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-secondary transition-all duration-500 rounded-full"
            style={{ width: `${((currentQ) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl p-8 sm:p-12 border border-gray-100 min-h-[350px] flex flex-col justify-center relative overflow-hidden">
        {isSubmitting ? (
           <div className="flex flex-col items-center justify-center h-full space-y-4">
             <Loader2 className="h-12 w-12 text-primary animate-spin" />
             <p className="font-bold text-primary animate-pulse">Analyzing responses...</p>
           </div>
        ) : (
          <div key={currentQ} className="animate-in slide-in-from-right-16 fade-in duration-500">
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-text mb-12 text-center leading-snug">
              {QUESTIONS[currentQ]}
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={() => handleAnswer('yes')}
                className="group p-6 rounded-2xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center gap-4"
              >
                <div className="h-16 w-16 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Check className="h-8 w-8" />
                </div>
                <span className="font-bold text-lg text-text">Yes</span>
              </button>
              
              <button 
                onClick={() => handleAnswer('no')}
                className="group p-6 rounded-2xl border-2 border-gray-100 hover:border-secondary hover:bg-secondary/5 transition-all flex flex-col items-center gap-4"
              >
                <div className="h-16 w-16 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <X className="h-8 w-8" />
                </div>
                <span className="font-bold text-lg text-text">No</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreliminaryAssessment;
