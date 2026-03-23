import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, ArrowRight } from 'lucide-react';

const DIET_TEMPLATES = [
  { id: 1, name: 'Standard Auto-Immune Protocol', age: '3 - 6 Years', meals: 4, assigned: 142 },
  { id: 2, name: 'Gluten-Free & Dairy-Free Basic', age: '0 - 2 Years', meals: 5, assigned: 89 },
  { id: 3, name: 'High Calorie Weight Gain', age: '3 - 6 Years', meals: 4, assigned: 34 },
];

const AdminDietPlans = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">Diet Plan Management</h2>
           <p className="text-muted font-medium text-sm mt-1">Manage nutritional templates and assigned patient diets.</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2">
           <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Col: Templates Manager */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border flex flex-col">
            <div className="p-5 border-b border-admin-border flex justify-between items-center bg-gray-50/50 rounded-t-xl">
               <h3 className="font-admin-heading font-bold text-text">Diet Templates</h3>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search templates..." className="pl-9 pr-4 py-1.5 bg-white border border-admin-border rounded-lg text-xs focus:ring-2 focus:ring-primary/20 outline-none w-48" />
               </div>
            </div>
            <div className="divide-y divide-admin-border">
              {DIET_TEMPLATES.map(temp => (
                <div key={temp.id} className="p-5 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row gap-4 justify-between sm:items-center group">
                  <div>
                    <h4 className="font-bold text-text mb-1 group-hover:text-primary transition-colors">{temp.name}</h4>
                    <div className="flex items-center gap-3 text-xs font-bold text-muted font-mono">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">{temp.age}</span>
                      <span>•</span>
                      <span>{temp.meals} meal slots</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xl font-black font-mono text-text">{temp.assigned}</p>
                      <p className="text-[10px] uppercase font-bold text-muted tracking-wider">Assigned</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white border border-admin-border rounded text-muted hover:text-accent transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 border border-admin-border rounded text-muted hover:text-admin-danger transition-colors bg-white"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Quick Access / Builder preview */}
        <div className="space-y-6">
          <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border p-5">
            <h3 className="font-admin-heading font-bold text-text mb-4">Food Database</h3>
            <p className="text-sm text-muted mb-4 font-medium leading-relaxed">Modify the global nutritional database, search items, and flag specific foods like allergens across the system.</p>
            <button className="w-full py-2 bg-gray-100 font-bold text-text hover:bg-gray-200 transition-colors rounded-lg flex justify-center items-center gap-2 border border-admin-border">
              Manage Database <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-admin-warning/10 border border-admin-warning/20 rounded-xl p-5">
             <h4 className="font-bold text-admin-warning flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-admin-warning animate-pulse"></span> Flagged Assignment Alert
             </h4>
             <p className="text-xs text-admin-warning/80 mt-2 font-medium">2 children have been assigned conflicting diets with their allergy charts. Immediate review required.</p>
             <button className="mt-3 text-xs font-bold text-white bg-admin-warning px-3 py-1.5 rounded shadow-sm hover:bg-admin-warning/90 transition-colors">Resolve Conflicts</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDietPlans;
