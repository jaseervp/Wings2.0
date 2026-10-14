import React, { useState, useEffect } from 'react';
import { X, Search, UtensilsCrossed, Apple, Trash2, Edit2, Loader2, Plus } from 'lucide-react';
import { adminDietApi } from '../services/adminDietApi';

export const ViewAllTemplatesModal = ({ isOpen, onClose, onSelectEdit, onOpenCreate, onUpdated }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen, search, category]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const res = await adminDietApi.getTemplates({ search, category });
      if (res.success && res.data) {
        setTemplates(res.data);
      }
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id, name) => {
    if (!confirm(`Are you sure you want to archive template "${name}"?`)) return;
    try {
      await adminDietApi.archiveTemplate(id);
      loadTemplates();
      if (onUpdated) onUpdated(`Template "${name}" archived`);
    } catch (err) {
      alert(err.message || 'Failed to archive template');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-black text-text tracking-tight">
                All Nutritional Diet Templates
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Complete directory of clinical templates, meal slots, and active patient assignment counts.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="py-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="General Nutrition">General Nutrition</option>
              <option value="Allergy-Aware">Allergy-Aware</option>
              <option value="Gluten-Free">Gluten-Free</option>
              <option value="Dairy-Free">Dairy-Free</option>
              <option value="Low Sugar">Low Sugar Focus</option>
              <option value="High Calorie">High Calorie</option>
            </select>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenCreate) onOpenCreate();
              }}
              className="px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary/90 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              New Template
            </button>
          </div>
        </div>

        {/* Templates Table */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p className="text-xs font-bold">Loading templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <UtensilsCrossed className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-gray-600">No Templates Found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or create a new template.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                    <th className="px-4 py-3">Template</th>
                    <th className="px-4 py-3">Target Age</th>
                    <th className="px-4 py-3">Meal Slots</th>
                    <th className="px-4 py-3 text-center">Assigned</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-gray-50 font-medium">
                  {templates.map((temp) => (
                    <tr key={temp.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${temp.iconBg} ${temp.iconColor} flex items-center justify-center shrink-0 border border-gray-100`}>
                            <Apple className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-text">{temp.name}</p>
                            <span className="text-[10px] text-gray-400 font-mono">{temp.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-gray-600 font-bold">
                        {temp.age}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {temp.meals} slots
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-mono font-black text-xs">
                          {temp.assigned}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {temp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleArchive(temp.id, temp.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-xs font-mono font-bold text-gray-500">
            Total {templates.length} Template(s)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-text text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
