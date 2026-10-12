import { useState } from 'react';
import { Search, Plus, Package, Edit2, Trash2, Tag, ShoppingCart, Percent, ShoppingBag, Download, AlertTriangle } from 'lucide-react';

const PRODUCTS = [
  { id: 'PRD-001', name: 'Sensory Chew Necklace', price: '₹450', stock: 124, category: 'Sensory Tools', status: 'Active', img: 'bg-emerald-500' },
  { id: 'PRD-002', name: 'Weighted Blanket (3kg)', price: '₹2,200', stock: 15, category: 'Therapy Aids', status: 'Low Stock', img: 'bg-amber-500' },
  { id: 'PRD-003', name: 'Visual Schedule Board', price: '₹850', stock: 0, category: 'Communication', status: 'Out of Stock', img: 'bg-red-500' },
  { id: 'PRD-004', name: 'Fidget Spinners Pack', price: '₹300', stock: 85, category: 'Sensory Tools', status: 'Active', img: 'bg-blue-500' },
  { id: 'PRD-005', name: 'Motor Skills Puzzle', price: '₹1,100', stock: 42, category: 'Educational', status: 'Active', img: 'bg-purple-500' },
];

const AdminStore = () => {
  const [activeTab, setActiveTab] = useState('Products');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight flex items-center gap-3">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
               <ShoppingBag className="w-6 h-6" />
             </div>
             Store Management
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Manage e-commerce inventory, customer orders, and promotions.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-4 py-2 bg-white text-text text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-primary transition-all flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4 text-gray-500" /> Export Inventory
          </button>
          <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/30 hover:bg-primary/90 hover:shadow-md transition-all flex items-center gap-2">
             <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Modern Tabs */}
        <div className="flex items-center gap-1 bg-gray-50/80 border-b border-gray-100 px-4 py-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 bg-white border border-gray-200/60 p-1.5 rounded-xl shadow-sm">
            {[
              { id: 'Products', icon: Package },
              { id: 'Orders', icon: ShoppingCart },
              { id: 'Categories', icon: Tag },
              { id: 'Discounts', icon: Percent }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  activeTab === tab.id ? 'bg-primary/10 text-primary shadow-sm' : 'text-gray-500 hover:text-text hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.id}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'Products' && (
          <>
            {/* Toolbar */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center gap-4 bg-gray-50/30">
              <div className="relative flex-1 md:max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input type="text" placeholder="Search products, SKUs..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 font-medium" />
              </div>
              <select className="bg-white border border-gray-200 text-sm rounded-xl px-4 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm hidden md:block cursor-pointer hover:bg-gray-50 transition-colors">
                <option>All Categories</option>
                <option>Sensory Tools</option>
                <option>Therapy Aids</option>
                <option>Communication</option>
                <option>Educational</option>
              </select>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Stock Level</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50 font-medium">
                  {PRODUCTS.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4 flex items-center gap-4 align-middle">
                         <div className={`w-12 h-12 rounded-xl ${prod.img} bg-opacity-10 border border-${prod.img.replace('bg-', '')}/20 flex items-center justify-center shrink-0`}>
                           <Package className={`w-5 h-5 text-${prod.img.replace('bg-', '')}`} />
                         </div>
                         <div>
                           <p className="font-bold text-text group-hover:text-primary transition-colors text-sm">{prod.name}</p>
                           <p className="text-[11px] text-gray-500 font-mono font-bold mt-0.5 bg-gray-100 inline-block px-1.5 py-0.5 rounded-md border border-gray-200">{prod.id}</p>
                         </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-black text-text align-middle">{prod.price}</td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-600 align-middle">{prod.category}</td>
                      <td className="px-6 py-4 align-middle">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono border transition-colors ${
                          prod.stock === 0 ? 'bg-red-50 text-red-700 border-red-200' : 
                          prod.stock < 20 ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}>
                          {prod.stock === 0 && <AlertTriangle className="w-3 h-3" />}
                          {prod.stock < 20 && prod.stock > 0 && <AlertTriangle className="w-3 h-3" />}
                          {prod.stock} Units
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                         <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${
                           prod.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                           prod.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                           'bg-red-50 text-red-700 border-red-200'
                         }`}>
                           {prod.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right align-middle">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-primary hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"><Edit2 className="w-4 h-4" /></button>
                          <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
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
                 Showing <span className="text-text">1</span> to <span className="text-text">5</span> of <span className="text-text">42</span> products
               </div>
               <div className="flex items-center gap-1">
                 <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm">Prev</button>
                 <button className="px-3 py-1.5 border border-primary rounded-lg bg-primary text-white text-xs font-bold shadow-sm shadow-primary/20">1</button>
                 <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors">2</button>
                 <span className="px-2 text-gray-400">...</span>
                 <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm">Next</button>
               </div>
            </div>
          </>
        )}
        
        {activeTab !== 'Products' && (
           <div className="p-16 text-center border-t border-gray-100 min-h-[400px] flex flex-col items-center justify-center bg-gray-50/30">
             <div className="w-16 h-16 bg-white border border-gray-200 shadow-sm rounded-2xl flex items-center justify-center mb-4 text-gray-400">
               {activeTab === 'Orders' && <ShoppingCart className="w-8 h-8"/>}
               {activeTab === 'Categories' && <Tag className="w-8 h-8"/>}
               {activeTab === 'Discounts' && <Percent className="w-8 h-8"/>}
             </div>
             <h3 className="text-xl font-admin-heading font-black text-text mb-2">{activeTab} View Placeholder</h3>
             <p className="text-gray-500 font-medium text-sm max-w-sm">This module is currently under development. Detailed {activeTab.toLowerCase()} logic will be implemented here.</p>
           </div>
        )}
        
      </div>
    </div>
  );
};

export default AdminStore;
