import { useState } from 'react';
import { Search, Filter, LayoutGrid, List, Plus, Download, ChevronRight, Brain, User, Calendar, Activity } from 'lucide-react';

const CHILDREN = [
  { id: 1, name: 'Aarav Sharma', age: '4 yrs 3 mo', parent: 'Priya Sharma', iq: 'Moderate', lastTest: '2 wks ago', bg: 'bg-emerald-500' },
  { id: 2, name: 'Vikram Singh', age: '5 yrs 1 mo', parent: 'Tanya Singh', iq: 'Mild', lastTest: '1 mo ago', bg: 'bg-blue-500' },
  { id: 3, name: 'Riya Patel', age: '3 yrs 8 mo', parent: 'Neha Patel', iq: 'Pending', lastTest: 'Never', bg: 'bg-gray-400' },
  { id: 4, name: 'Aanya Reddy', age: '6 yrs 0 mo', parent: 'Rahul Reddy', iq: 'Severe', lastTest: '3 days ago', bg: 'bg-amber-500' },
  { id: 5, name: 'Kabir Khan', age: '5 yrs 11 mo', parent: 'Zoya Khan', iq: 'Profound', lastTest: '6 mo ago', bg: 'bg-red-500' },
  { id: 6, name: 'Ananya Gupta', age: '4 yrs 1 mo', parent: 'Rohan Gupta', iq: 'Mild', lastTest: '1 wk ago', bg: 'bg-blue-500' },
];

const AdminChildren = () => {
  const [view, setView] = useState('grid');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight">Children Profiles</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Manage and monitor developmental profiles and clinical histories.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white text-text text-sm font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4 text-gray-500" /> Export Data
          </button>
          <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm shadow-primary/30 hover:bg-primary/90 hover:shadow-md transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Child
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        
        {/* Filters Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-gray-50/50">
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="relative">
              <select className="bg-white border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors">
                <option>Age Range: All</option>
                <option>0 - 2 Years</option>
                <option>3 - 4 Years</option>
                <option>5 - 6 Years</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Filter className="w-4 h-4" />
              </div>
            </div>
            
            <div className="relative">
              <select className="bg-white border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors">
                <option>Gender: All</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Filter className="w-4 h-4" />
              </div>
            </div>

            <div className="relative">
              <select className="bg-white border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors">
                <option>IQ Band: All</option>
                <option>Mild</option>
                <option>Moderate</option>
                <option>Severe</option>
                <option>Profound</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Brain className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input type="text" placeholder="Search children or parents..." className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 font-medium" />
            </div>
            <div className="flex items-center gap-1 bg-gray-100/80 border border-gray-200/60 p-1 rounded-xl shadow-inner shrink-0">
              <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-white text-primary shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-text hover:bg-gray-200/50'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-white text-primary shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-text hover:bg-gray-200/50'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {view === 'grid' && (
          <div className="p-6 bg-gray-50/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {CHILDREN.map((child) => (
                <div key={child.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:border-gray-300 hover:shadow-md transition-all group flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-gray-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                  
                  <div className="flex gap-4 items-center mb-6">
                    <div className={`w-14 h-14 rounded-full ${child.bg} text-white font-black flex items-center justify-center text-xl shrink-0 shadow-inner border-2 border-white ring-2 ring-gray-50 group-hover:scale-105 transition-transform`}>
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-admin-heading font-bold text-text group-hover:text-primary transition-colors leading-tight">{child.name}</h3>
                      <p className="text-xs text-gray-500 font-mono mt-1 font-bold">{child.age}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Parent</span>
                      <span className="font-bold text-text truncate max-w-[120px]">{child.parent}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Diagnosis</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        child.iq === 'Pending' ? 'bg-gray-100 text-gray-500' : 
                        child.iq === 'Mild' ? 'bg-blue-50 text-blue-600' : 
                        child.iq === 'Moderate' ? 'bg-emerald-50 text-emerald-600' : 
                        child.iq === 'Severe' ? 'bg-amber-50 text-amber-600' : 
                        'bg-red-50 text-red-600'
                      }`}>
                        {child.iq}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Last Exam</span>
                      <span className="font-mono text-gray-600 font-bold text-xs">{child.lastTest}</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group/btn shadow-sm">
                    View Full Profile <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                  <th className="px-6 py-4 w-12 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
                  </th>
                  <th className="px-6 py-4">Child Details</th>
                  <th className="px-6 py-4">Parent / Guardian</th>
                  <th className="px-6 py-4 text-center">Age</th>
                  <th className="px-6 py-4">Diagnosis</th>
                  <th className="px-6 py-4">Last Assessment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50 font-medium">
                {CHILDREN.map((child) => (
                  <tr key={child.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 w-12 text-center align-middle">
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${child.bg} text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm border-2 border-white`}>
                          {child.name.charAt(0)}
                        </div>
                        <p className="font-bold text-text group-hover:text-primary transition-colors text-sm">{child.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm align-middle">{child.parent}</td>
                    <td className="px-6 py-4 text-center align-middle">
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 font-mono font-bold text-xs border border-gray-200">
                        {child.age}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        child.iq === 'Pending' ? 'bg-gray-50 text-gray-600 border-gray-200' : 
                        child.iq === 'Mild' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        child.iq === 'Moderate' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        child.iq === 'Severe' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {child.iq}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs font-semibold align-middle font-mono">{child.lastTest}</td>
                    <td className="px-6 py-4 text-right align-middle">
                      <button className="text-xs font-bold text-primary hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100 opacity-0 group-hover:opacity-100">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
           <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
             Showing <span className="text-text">1</span> to <span className="text-text">6</span> of <span className="text-text">1,203</span> children
           </div>
           <div className="flex items-center gap-1">
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm">Prev</button>
             <button className="px-3 py-1.5 border border-primary rounded-lg bg-primary text-white text-xs font-bold shadow-sm shadow-primary/20">1</button>
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors">2</button>
             <span className="px-2 text-gray-400">...</span>
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm">Next</button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminChildren;
