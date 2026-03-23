import { useState } from 'react';
import { Plus, Search, Newspaper, FileText, CheckCircle2 } from 'lucide-react';

const ARTICLES = [
  { id: 1, title: 'How to apply for Niramaya Health Insurance', category: 'Insurance', status: 'Published', views: '1,204', date: 'Oct 15, 2024' },
  { id: 2, title: 'Understanding UD ID Card Benefits', category: 'UD ID Card', status: 'Published', views: '943', date: 'Oct 12, 2024' },
  { id: 3, title: 'State Grants available for Autism', category: 'Grants', status: 'Draft', views: '-', date: 'Oct 20, 2024' },
];

const AdminInfoHub = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">Info Hub Content</h2>
           <p className="text-muted font-medium text-sm mt-1">Manage articles, resources, and downloadable files.</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2">
           <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border flex flex-col">
        <div className="p-4 border-b border-admin-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           {/* Categories */}
           <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              {['All', 'Grants', 'Insurance', 'UD ID Card', 'Schemes'].map(tab => (
                 <button key={tab} className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap transition-colors border ${tab === 'All' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white text-muted border-admin-border hover:bg-gray-50'}`}>
                   {tab}
                 </button>
              ))}
           </div>
           
           <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search articles..." className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-admin-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-admin-border text-[11px] uppercase tracking-wider text-muted font-bold font-mono">
                <th className="px-6 py-4">Article Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-admin-border font-medium">
               {ARTICLES.map((art) => (
                 <tr key={art.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                   <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
                           <Newspaper className="w-4 h-4 text-muted" />
                         </div>
                         <p className="font-bold text-text group-hover:text-primary transition-colors line-clamp-1">{art.title}</p>
                      </div>
                   </td>
                   <td className="px-6 py-4 text-xs font-bold text-muted">{art.category}</td>
                   <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 w-fit ${
                        art.status === 'Published' ? 'bg-success/10 text-success' : 'bg-gray-100 text-muted'
                      }`}>
                        {art.status === 'Published' && <CheckCircle2 className="w-3 h-3" />}
                        {art.status}
                      </span>
                   </td>
                   <td className="px-6 py-4 font-mono font-bold text-muted text-xs">{art.views}</td>
                   <td className="px-6 py-4 text-xs font-mono text-muted">{art.date}</td>
                   <td className="px-6 py-4 text-right">
                     <button className="text-xs font-bold text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInfoHub;
