import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check, Camera, User, FileText, Heart, ShieldCheck } from 'lucide-react';
import { cn } from '../../layouts/DashboardLayout';

const STEPS = [
  { title: "Basic Info", icon: User },
  { title: "Medical", icon: Heart },
  { title: "Parent", icon: FileText },
  { title: "Consent", icon: ShieldCheck }
];

const AddChildProfile = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((prev) => prev + 1);
    else navigate('/dashboard');
  };
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-heading font-extrabold text-primary mb-2">Child Profile</h2>
        <p className="text-muted">Tell us about your child to personalize their Wings journey</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-12 relative flex justify-between">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
        {STEPS.map((step, i) => {
          const isActive = i === currentStep;
          const isCompleted = i < currentStep;
          return (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-sm",
                isActive ? "bg-primary border-white text-white scale-110" :
                isCompleted ? "bg-primary border-white text-white" :
                "bg-white border-gray-200 text-gray-400"
              )}>
                {isCompleted ? <Check className="h-6 w-6" /> : <step.icon className="h-5 w-5" />}
              </div>
              <span className={cn(
                "text-xs font-bold transition-colors absolute -bottom-6 w-24 text-center",
                isActive ? "text-primary" : isCompleted ? "text-text" : "text-gray-400"
              )}>{step.title}</span>
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 sm:p-12 min-h-[400px] border border-gray-100 flex flex-col">
        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="flex justify-center mb-8">
               <div className="relative group cursor-pointer">
                 <div className="w-28 h-28 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
                   <User className="h-10 w-10 text-gray-400 group-hover:text-primary transition-colors" />
                 </div>
                 <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
                   <Camera className="h-4 w-4" />
                 </div>
               </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text">Child's Name</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text">Date of Birth</label>
                <input type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text">Gender</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
           <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
             <div className="space-y-2">
                <label className="text-sm font-bold text-text">Were there any birth complications?</label>
                <div className="flex gap-4">
                  <label className="flex-1 border-2 border-gray-100 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-primary transition-all">
                    <input type="radio" name="complications" value="yes" className="w-4 h-4 text-primary focus:ring-primary" />
                    <span className="font-medium">Yes</span>
                  </label>
                  <label className="flex-1 border-2 border-gray-100 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-primary transition-all">
                    <input type="radio" name="complications" value="no" className="w-4 h-4 text-primary focus:ring-primary" />
                    <span className="font-medium">No</span>
                  </label>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text">Blood Group</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all">
                    <option value="">Select</option>
                    <option value="o+">O+</option>
                    <option value="a+">A+</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text">Known Conditions (Optional)</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="e.g. Asthma" />
                </div>
              </div>
           </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
             <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text">Parent/Guardian Name</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Enter name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text">Relationship to Child</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all">
                  <option value="">Select</option>
                  <option value="mother">Mother</option>
                  <option value="father">Father</option>
                  <option value="guardian">Legal Guardian</option>
                </select>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-sm font-bold text-text">Emergency Contact Number</label>
                <input type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="+91 xxxxx xxxxx" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 text-center py-8 animate-in fade-in slide-in-from-right-8 duration-300 flex-1 flex flex-col justify-center">
             <div className="h-20 w-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
               <ShieldCheck className="h-10 w-10" />
             </div>
             <h3 className="text-xl font-heading font-bold text-text">Almost done!</h3>
             <p className="text-muted text-sm max-w-md mx-auto">By submitting this profile, you agree to our terms of service and consent to Wings securely storing your child's data to provide personalized care.</p>
             <div className="flex items-start justify-center gap-3 mt-4 text-left max-w-sm mx-auto p-4 bg-gray-50 rounded-xl border border-gray-100">
               <input type="checkbox" id="consent" className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
               <label htmlFor="consent" className="text-sm text-text font-medium leading-tight">
                 I confirm that all provided information is accurate and I give consent for data processing.
               </label>
             </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="mt-auto pt-10 flex justify-between">
          <button 
            onClick={handleBack}
            className={cn(
              "px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all",
              currentStep === 0 ? "opacity-0 pointer-events-none" : "text-muted hover:bg-gray-100"
            )}
          >
            <ChevronLeft className="h-5 w-5" /> Back
          </button>
          <button 
            onClick={handleNext}
            className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            {currentStep === STEPS.length - 1 ? 'Complete Profile' : 'Continue'} <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddChildProfile;
