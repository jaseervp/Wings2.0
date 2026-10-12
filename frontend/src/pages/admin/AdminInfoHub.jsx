import { useState } from 'react';
import { Plus, Search, Newspaper, CheckCircle2, Edit2, Trash2, LibraryBig, ExternalLink, Download, LayoutGrid, List } from 'lucide-react';

const ARTICLES = [
  { id: 1, title: 'How to apply for Niramaya Health Insurance', category: 'Insurance', status: 'Published', views: '1,204', date: 'Oct 15, 2024' },
  { id: 2, title: 'Understanding UD ID Card Benefits', category: 'UD ID Card', status: 'Published', views: '943', date: 'Oct 12, 2024' },
  { id: 3, title: 'State Grants available for Autism', category: 'Grants', status: 'Draft', views: '-', date: 'Oct 20, 2024' },
  { id: 4, title: 'Legal Rights in Inclusive Education', category: 'Legal Rights', status: 'Published', views: '2,156', date: 'Sep 28, 2024' },
  { id: 5, title: 'Tax Exemptions under Section 80U', category: 'Financial', status: 'Archived', views: '512', date: 'Aug 14, 2024' },
];

const AdminInfoHub = () => {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight flex items-center gap-3">
             <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
               <LibraryBig className="w-6 h-6" />
             </div>
             Info Hub Content
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Manage parent support articles, resources, schemas, and downloadable files.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/30 hover:bg-primary/90 hover:shadow-md transition-all flex items-center gap-2">
             <Plus className="w-4 h-4" /> New Article
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-gray-50/50">
           
           {/* Modern Tabs */}
           <div className="flex items-center gap-1 bg-gray-100/80 border border-gray-200/60 p-1.5 rounded-xl shadow-inner w-full md:w-auto overflow-x-auto scrollbar-hide">
              {['All', 'Grants', 'Insurance', 'UD ID Card', 'Schemes', 'Legal Rights', 'Financial'].map(tab => (
                 <button 
                   key={tab} 
                   onClick={() => setActiveTab(tab)}
                   className={`px-4 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                     activeTab === tab ? 'bg-white text-primary shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-text hover:bg-gray-200/50'
                   }`}
                 >
                   {tab}
                 </button>
              ))}
           </div>
           
           <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
             <div className="relative flex-1 w-full md:w-72 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input type="text" placeholder="Search knowledge base..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 font-medium" />
              </div>
              <div className="flex items-center gap-1 bg-gray-100/80 border border-gray-200/60 p-1.5 rounded-xl shadow-inner shrink-0 w-full justify-center md:w-auto md:justify-start">
                <button className="p-2 bg-white text-primary shadow-sm border border-gray-200/50 rounded-lg transition-all flex items-center justify-center">
                  <List className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-text hover:bg-gray-200/50 rounded-lg transition-all flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
           </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                <th className="px-6 py-4">Article Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50 font-medium">
               {ARTICLES.map((art) => (
                 <tr key={art.id} className="hover:bg-gray-50/80 transition-colors group">
                   <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                           <Newspaper className="w-5 h-5 text-gray-500" />
                         </div>
                         <p className="font-bold text-text group-hover:text-primary transition-colors text-sm leading-tight max-w-sm">{art.title}</p>
                      </div>
                   </td>
                   <td className="px-6 py-4 align-middle">
                     <span className="text-[11px] font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md inline-block">{art.category}</span>
                   </td>
                   <td className="px-6 py-4 align-middle">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${
                        art.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        art.status === 'Draft' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {art.status === 'Published' && <CheckCircle2 className="w-3 h-3" />}
                        {art.status}
                      </span>
                   </td>
                   <td className="px-6 py-4 font-mono font-bold text-gray-600 text-sm align-middle">{art.views}</td>
                   <td className="px-6 py-4 text-xs font-mono font-semibold text-gray-500 align-middle">{art.date}</td>
                   <td className="px-6 py-4 text-right align-middle">
                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-primary hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-primary hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"><ExternalLink className="w-4 h-4" /></button>
                        <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
                      </div>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
           <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
             Showing <span className="text-text">1</span> to <span className="text-text">5</span> of <span className="text-text">145</span> articles
           </div>
           <div className="flex items-center gap-1">
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm">Prev</button>
             <button className="px-3 py-1.5 border border-primary rounded-lg bg-primary text-white text-xs font-bold shadow-sm shadow-primary/20">1</button>
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors">2</button>
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors">3</button>
             <span className="px-2 text-gray-400">...</span>
             <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm">Next</button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminInfoHub;
