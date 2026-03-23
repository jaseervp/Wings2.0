import { useState } from 'react';
import { Search, Plus, Package, Edit2, Trash2, Tag, ShoppingCart, Percent } from 'lucide-react';

const PRODUCTS = [
  { id: 'PRD-001', name: 'Sensory Chew Necklace', price: '₹450', stock: 124, category: 'Sensory Tools', status: 'Active', img: 'bg-primary' },
  { id: 'PRD-002', name: 'Weighted Blanket (3kg)', price: '₹2,200', stock: 15, category: 'Therapy Aids', status: 'Low Stock', img: 'bg-accent' },
  { id: 'PRD-003', name: 'Visual Schedule Board', price: '₹850', stock: 0, category: 'Communication', status: 'Out of Stock', img: 'bg-admin-warning' },
];

const AdminStore = () => {
  const [activeTab, setActiveTab] = useState('Products');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">Store Management</h2>
           <p className="text-muted font-medium text-sm mt-1">Manage e-commerce inventory, orders, and promotions.</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2">
           <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border flex flex-col">
        {/* Tabs */}
        <div className="flex bg-gray-50/50 border-b border-admin-border px-4 py-3 gap-6 overflow-x-auto scrollbar-hide">
          {[
            { id: 'Products', icon: Package },
            { id: 'Orders', icon: ShoppingCart },
            { id: 'Categories', icon: Tag },
            { id: 'Discounts', icon: Percent }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-2 text-sm font-bold transition-all border-b-2 -mb-3.5 ${activeTab === tab.id ? 'text-primary border-primary' : 'text-muted border-transparent hover:text-text'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.id}
            </button>
          ))}
        </div>

        {activeTab === 'Products' && (
          <>
            <div className="p-4 border-b border-admin-border flex justify-between items-center gap-4">
              <div className="relative flex-1 md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search products, SKUs..." className="w-full pl-9 pr-4 py-2 bg-white border border-admin-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <select className="bg-white border border-admin-border text-sm rounded-lg px-3 py-2 outline-none font-bold text-muted hidden md:block">
                <option>All Categories</option>
                <option>Sensory Tools</option>
                <option>Therapy Aids</option>
              </select>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-admin-border text-[11px] uppercase tracking-wider text-muted font-bold font-mono">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-admin-border font-medium">
                  {PRODUCTS.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-lg ${prod.img}/20 flex items-center justify-center shrink-0`}>
                           <Package className={`w-5 h-5 text-gray-500`} />
                         </div>
                         <div>
                           <p className="font-bold text-text group-hover:text-primary transition-colors">{prod.name}</p>
                           <p className="text-xs text-muted font-mono">{prod.id}</p>
                         </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-text">{prod.price}</td>
                      <td className="px-6 py-4 text-xs font-bold text-muted">{prod.category}</td>
                      <td className="px-6 py-4 font-mono font-bold text-text">
                        <span className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer transition-colors border border-transparent hover:border-admin-border inline-block">
                          {prod.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                           prod.status === 'Active' ? 'bg-success/10 text-success' : 
                           prod.status === 'Low Stock' ? 'bg-admin-warning/10 text-admin-warning' : 
                           'bg-admin-danger/10 text-admin-danger'
                         }`}>
                           {prod.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-muted hover:text-accent hover:bg-accent/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button className="p-1.5 text-muted hover:text-admin-danger hover:bg-admin-danger/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        
        {activeTab !== 'Products' && (
           <div className="p-16 text-center text-muted font-medium">
             Placeholder for {activeTab} view logic.
           </div>
        )}
        
      </div>
    </div>
  );
};

export default AdminStore;
