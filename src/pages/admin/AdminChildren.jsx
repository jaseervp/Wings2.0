import { useState } from 'react';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';

const CHILDREN = [
  { id: 1, name: 'Aarav Sharma', age: '4 yrs 3 mo', parent: 'Priya Sharma', iq: 'Moderate', lastTest: '2 wks ago', avatar: 'bg-primary' },
  { id: 2, name: 'Vikram Singh', age: '5 yrs 1 mo', parent: 'Tanya Singh', iq: 'Mild', lastTest: '1 mo ago', avatar: 'bg-accent' },
  { id: 3, name: 'Riya Patel', age: '3 yrs 8 mo', parent: 'Neha Patel', iq: 'Pending', lastTest: 'Never', avatar: 'bg-gray-400' },
  { id: 4, name: 'Aanya Reddy', age: '6 yrs 0 mo', parent: 'Rahul Reddy', iq: 'Severe', lastTest: '3 days ago', avatar: 'bg-admin-warning' },
];

const AdminChildren = () => {
  const [view, setView] = useState('grid');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">Children Profiles</h2>
          <p className="text-muted font-medium text-sm mt-1">Manage and view detailed profiles and clinical history.</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <select className="bg-gray-50 border border-admin-border text-sm rounded-lg px-3 py-2 outline-none font-bold text-muted focus:border-primary">
            <option>Age Range: All</option>
            <option>0 - 2 Years</option>
            <option>3 - 4 Years</option>
            <option>5 - 6 Years</option>
          </select>
          <select className="bg-gray-50 border border-admin-border text-sm rounded-lg px-3 py-2 outline-none font-bold text-muted focus:border-primary">
            <option>Gender: All</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          <select className="bg-gray-50 border border-admin-border text-sm rounded-lg px-3 py-2 outline-none font-bold text-muted focus:border-primary">
            <option>IQ Band: All</option>
            <option>Mild</option>
            <option>Moderate</option>
            <option>Severe</option>
            <option>Profound</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search children..." className="w-full pl-9 pr-4 py-2 bg-white border border-admin-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>
          <div className="flex bg-gray-50 border border-admin-border rounded-lg p-1">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-white text-text shadow-sm' : 'text-muted hover:text-text'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white text-text shadow-sm' : 'text-muted hover:text-text'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CHILDREN.map((child) => (
            <div key={child.id} className="bg-admin-surface rounded-xl shadow-sm border border-admin-border p-5 hover:border-primary/30 transition-colors group flex flex-col">
              <div className="flex gap-4 items-start mb-4">
                <div className={`w-14 h-14 rounded-full ${child.avatar} text-white font-bold flex items-center justify-center text-xl shrink-0 shadow-inner`}>
                  {child.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-admin-heading font-bold text-text group-hover:text-primary transition-colors line-clamp-1 break-all">{child.name}</h3>
                  <p className="text-xs text-muted font-mono mt-1">Age: {child.age}</p>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                  <span className="text-muted">Parent</span>
                  <span className="font-bold text-primary hover:underline cursor-pointer truncate max-w-[120px]">{child.parent}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                  <span className="text-muted">IQ Band</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${child.iq === 'Pending' ? 'bg-gray-100 text-gray-500' : child.iq === 'Mild' ? 'bg-accent/10 text-accent' : child.iq === 'Moderate' ? 'bg-primary/10 text-primary' : 'bg-admin-warning/10 text-admin-warning'}`}>
                    {child.iq}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pb-2">
                  <span className="text-muted">Last Test</span>
                  <span className="font-mono text-text font-bold text-xs">{child.lastTest}</span>
                </div>
              </div>
              <button className="w-full mt-4 py-2 rounded-lg border border-admin-border text-sm font-bold text-text hover:bg-gray-50 transition-colors">
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}

      {/* List View placeholder for brevity */}
      {view === 'list' && (
        <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border p-8 text-center text-muted">
           Table list view mapped similarly to User Management...
        </div>
      )}

    </div>
  );
};

export default AdminChildren;
