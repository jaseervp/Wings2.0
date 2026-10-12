import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, ArrowRight, UtensilsCrossed, Apple, AlertTriangle } from 'lucide-react';

const DIET_TEMPLATES = [
  { id: 1, name: 'Standard Auto-Immune Protocol', age: '3 - 6 Years', meals: 4, assigned: 142, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { id: 2, name: 'Gluten-Free & Dairy-Free Basic', age: '0 - 2 Years', meals: 5, assigned: 89, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { id: 3, name: 'High Calorie Weight Gain', age: '3 - 6 Years', meals: 4, assigned: 34, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  { id: 4, name: 'Low Sugar Focus', age: '7 - 12 Years', meals: 3, assigned: 112, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
];

const AdminDietPlans = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight flex items-center gap-3">
             <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
               <UtensilsCrossed className="w-6 h-6" />
             </div>
             Diet Plan Management
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Manage nutritional templates and monitor assigned patient diets.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/30 hover:bg-primary/90 hover:shadow-md transition-all flex items-center gap-2">
           <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Col: Templates Manager */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
               <h3 className="font-admin-heading font-bold text-text text-lg">Diet Templates</h3>
               <div className="relative w-full sm:w-auto group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input type="text" placeholder="Search templates..." className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 font-medium" />
               </div>
            </div>
            
            <div className="divide-y divide-gray-50">
              {DIET_TEMPLATES.map(temp => (
                <div key={temp.id} className="p-5 hover:bg-gray-50/80 transition-colors flex flex-col sm:flex-row gap-4 justify-between sm:items-center group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${temp.iconBg} ${temp.iconColor} flex items-center justify-center shrink-0 border border-gray-100 shadow-sm group-hover:scale-105 transition-transform`}>
                      <Apple className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text mb-1.5 group-hover:text-primary transition-colors text-base">{temp.name}</h4>
                      <div className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500 font-mono">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">{temp.age}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="flex items-center gap-1.5 text-gray-600"><UtensilsCrossed className="w-3 h-3"/> {temp.meals} meal slots</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:pl-4">
                    <div className="text-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                      <p className="text-xl font-black font-mono text-text leading-none">{temp.assigned}</p>
                      <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mt-1">Assigned</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-primary hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination placeholder */}
            <div className="p-5 border-t border-gray-100 flex items-center justify-center bg-gray-50/50">
              <button className="text-sm font-bold text-primary hover:text-blue-800 transition-colors flex items-center gap-2">
                View All Templates <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Quick Access / Builder preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-start relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-gray-50 rounded-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-5 shadow-sm text-gray-500">
              <Apple className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-admin-heading font-black text-text mb-2">Food Database</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">Modify the global nutritional database, search items, and flag specific foods like allergens across the system.</p>
            <button className="w-full py-2.5 bg-gray-50 font-bold text-gray-700 hover:text-primary hover:bg-blue-50 border border-gray-200 hover:border-blue-100 transition-all rounded-xl flex justify-center items-center gap-2 shadow-sm">
              Manage Database <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-amber-50 rounded-2xl shadow-sm border border-amber-200 p-6 flex flex-col items-start relative overflow-hidden">
             <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/40 rounded-bl-full -z-10"></div>
             
             <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center mb-4 text-amber-600 shadow-sm">
               <AlertTriangle className="w-6 h-6" />
             </div>
             <h4 className="font-admin-heading font-black text-amber-800 flex items-center gap-2 text-lg">
               Flagged Assignment Alert
             </h4>
             <p className="text-sm text-amber-700/80 mt-2 font-medium leading-relaxed">2 children have been assigned conflicting diets with their allergy charts. Immediate review required.</p>
             
             <button className="mt-5 w-full font-bold text-white bg-amber-600 py-2.5 rounded-xl shadow-sm shadow-amber-600/20 hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
               Resolve Conflicts <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDietPlans;
