import { useState } from 'react';
import { BrainCircuit, AlertCircle, TrendingUp, Sparkles, Target, Activity, FileText } from 'lucide-react';

const DoctorInsights = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-gray-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
               <BrainCircuit className="w-6 h-6" />
             </div>
             AI Clinical Insights
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Predictive forecasting and automated risk analysis for your patient roster.</p>
        </div>
        <div className="flex gap-3 text-sm font-bold text-gray-500">
           Last analyzed: 2 hours ago
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Column: Risk Indicators */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                   <AlertCircle className="w-5 h-5 text-amber-500" /> Action Required (Risk Indicators)
                 </h3>
               </div>

               <div className="space-y-4">
                 
                 <div className="p-5 rounded-xl border border-red-100 bg-red-50/50 flex flex-col sm:flex-row gap-4 justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wider">High Priority</span>
                        <span className="text-sm font-black text-gray-800">Aarav Patel</span>
                      </div>
                      <h4 className="text-sm font-bold text-red-600 mb-2">Plateau in Expressive Language Progress</h4>
                      <p className="text-xs font-medium text-gray-600 leading-relaxed max-w-2xl">
                        Aarav's assessment scores for expressive language have remained static for 3 consecutive weeks despite consistent therapy sessions. The predictive model suggests current intervention methods may be losing efficacy.
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0">
                      Review Case
                    </button>
                 </div>

                 <div className="p-5 rounded-xl border border-amber-100 bg-amber-50/50 flex flex-col sm:flex-row gap-4 justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider">Medium Priority</span>
                        <span className="text-sm font-black text-gray-800">Riya Sharma</span>
                      </div>
                      <h4 className="text-sm font-bold text-amber-600 mb-2">Decreased Parent Engagement</h4>
                      <p className="text-xs font-medium text-gray-600 leading-relaxed max-w-2xl">
                        System detected a 40% drop in home-exercise video uploads over the last 14 days. Lack of home reinforcement poses a risk to fine motor skill development goals.
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0">
                      Message Parent
                    </button>
                 </div>

               </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                   <Sparkles className="w-5 h-5 text-indigo-500" /> Therapy Optimization Suggestions
                 </h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-5 border border-gray-100 bg-gray-50 rounded-xl hover:border-indigo-200 transition-colors cursor-pointer group">
                    <Target className="w-5 h-5 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-black text-gray-800 mb-2">Introduce PECS for Kabir</h4>
                    <p className="text-xs font-medium text-gray-500 mb-4">Based on high visual processing scores but low verbal output, Picture Exchange Communication System is highly recommended.</p>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">Apply Suggestion &rarr;</span>
                 </div>
                 <div className="p-5 border border-gray-100 bg-gray-50 rounded-xl hover:border-indigo-200 transition-colors cursor-pointer group">
                    <Activity className="w-5 h-5 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-black text-gray-800 mb-2">Increase Frequency for Ananya</h4>
                    <p className="text-xs font-medium text-gray-500 mb-4">Current progress trajectory indicates target goals will be missed. Suggesting an increase from 1 to 2 occupational therapy sessions per week.</p>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">Adjust Plan &rarr;</span>
                 </div>
               </div>
            </div>
         </div>

         {/* Right Column: Progress Forecasting */}
         <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-[#0B1120] rounded-2xl shadow-sm border border-gray-800 p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <TrendingUp className="w-32 h-32 text-blue-500" />
               </div>
               
               <div className="relative z-10">
                 <h3 className="text-base font-black text-white mb-2">Global Progress Forecast</h3>
                 <p className="text-xs font-medium text-gray-400 mb-6">AI projected outcomes for your active caseload over the next 90 days.</p>
                 
                 <div className="space-y-5">
                   <div>
                     <div className="flex justify-between items-end mb-2">
                       <p className="text-xs font-bold text-gray-300">Speech Articulation Targets</p>
                       <span className="text-xs font-black text-emerald-400">82% Success Prob.</span>
                     </div>
                     <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full w-[82%]"></div>
                     </div>
                   </div>

                   <div>
                     <div className="flex justify-between items-end mb-2">
                       <p className="text-xs font-bold text-gray-300">Fine Motor Skill Targets</p>
                       <span className="text-xs font-black text-blue-400">75% Success Prob.</span>
                     </div>
                     <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 rounded-full w-[75%]"></div>
                     </div>
                   </div>

                   <div>
                     <div className="flex justify-between items-end mb-2">
                       <p className="text-xs font-bold text-gray-300">Behavioral Goal Targets</p>
                       <span className="text-xs font-black text-amber-400">60% Success Prob.</span>
                     </div>
                     <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                       <div className="h-full bg-amber-500 rounded-full w-[60%]"></div>
                     </div>
                   </div>
                 </div>

                 <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs font-bold text-gray-300 leading-relaxed text-center">
                      "Overall cohort trajectory is positive. Behavioral goals require the most attention."
                    </p>
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
               <FileText className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
               <h3 className="text-sm font-black text-gray-800 mb-2">Need a detailed analysis?</h3>
               <p className="text-xs font-medium text-gray-500 mb-4">Generate a comprehensive AI clinical insights report for your records.</p>
               <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                 Generate Full Report
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DoctorInsights;
