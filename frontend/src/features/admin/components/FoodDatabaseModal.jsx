import React, { useState, useEffect } from 'react';
import { X, Apple, Search, Plus, Trash2, Edit2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminDietApi } from '../services/adminDietApi';

const FOOD_CATEGORIES = [
  'ALL', 'Grains', 'Proteins', 'Dairy & Alternatives', 'Fruits & Vegetables', 'Snacks'
];

export const FoodDatabaseModal = ({ isOpen, onClose, onUpdated }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  // New Food Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodCategory, setNewFoodCategory] = useState('Grains');
  const [newFoodAllergens, setNewFoodAllergens] = useState('');
  const [newFoodServing, setNewFoodServing] = useState('1 serving');
  const [newFoodCalories, setNewFoodCalories] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFoods();
    }
  }, [isOpen, search, category]);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const res = await adminDietApi.getFoods({ search, category });
      if (res.success && res.data) {
        setFoods(res.data);
      }
    } catch (err) {
      console.error('Failed to load foods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFood = async (e) => {
    e.preventDefault();
    if (!newFoodName.trim()) return;

    try {
      setSubmitting(true);
      const allergensList = newFoodAllergens
        .split(/[,;]+/)
        .map((a) => a.trim())
        .filter(Boolean);

      const res = await adminDietApi.createFood({
        name: newFoodName.trim(),
        category: newFoodCategory,
        allergens: allergensList,
        servingUnit: newFoodServing.trim() || '1 serving',
        nutrition: {
          calories: newFoodCalories ? Number(newFoodCalories) : undefined,
        },
      });

      if (res.success) {
        setNewFoodName('');
        setNewFoodAllergens('');
        setNewFoodCalories('');
        setShowAddForm(false);
        loadFoods();
        if (onUpdated) onUpdated('Food item added to database');
      }
    } catch (err) {
      console.error('Error creating food:', err);
      alert(err.message || 'Failed to add food item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFood = async (id) => {
    if (!confirm('Are you sure you want to deactivate this food item?')) return;
    try {
      await adminDietApi.deleteFood(id);
      loadFoods();
      if (onUpdated) onUpdated('Food item updated');
    } catch (err) {
      alert(err.message || 'Failed to delete food');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 text-gray-700 rounded-xl">
              <Apple className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-black text-text tracking-tight">
                Global Food Database
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Manage global ingredients, nutritional values, and associated allergen flags.
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
              placeholder="Search foods..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 outline-none"
            >
              {FOOD_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              {showAddForm ? 'Close Form' : 'Add Food'}
            </button>
          </div>
        </div>

        {/* Add Food Form */}
        {showAddForm && (
          <form onSubmit={handleCreateFood} className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl mb-4 space-y-3 shrink-0 animate-in fade-in">
            <h4 className="text-xs font-bold text-text uppercase font-mono">Add New Food Item</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Food Name *</label>
                <input
                  type="text"
                  required
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  placeholder="e.g. Quinoa"
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Category</label>
                <select
                  value={newFoodCategory}
                  onChange={(e) => setNewFoodCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-primary"
                >
                  <option value="Grains">Grains</option>
                  <option value="Proteins">Proteins</option>
                  <option value="Dairy & Alternatives">Dairy & Alternatives</option>
                  <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Allergens (comma separated)</label>
                <input
                  type="text"
                  value={newFoodAllergens}
                  onChange={(e) => setNewFoodAllergens(e.target.value)}
                  placeholder="e.g. Gluten, Dairy"
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-text rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary/90 flex items-center gap-1.5"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Save Food Item
              </button>
            </div>
          </form>
        )}

        {/* Food Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p className="text-xs font-bold">Loading food database...</p>
            </div>
          ) : foods.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Apple className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-gray-600">No Food Items Found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search or add a new food item.</p>
            </div>
          ) : (
            foods.map((food) => (
              <div
                key={food.id}
                className="p-3.5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
                    <Apple className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-sm text-text truncate">{food.name}</h5>
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono text-[10px] uppercase font-bold">
                        {food.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
                      <span>Serving: {food.servingUnit || '1 serving'}</span>
                      {food.nutrition?.calories && (
                        <span>• {food.nutrition.calories} kcal</span>
                      )}
                      {food.allergens && food.allergens.length > 0 && (
                        <div className="flex items-center gap-1">
                          {food.allergens.map((a) => (
                            <span
                              key={a}
                              className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[10px] font-bold"
                            >
                              ⚠ {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDeleteFood(food.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-text text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Database
          </button>
        </div>
      </div>
    </div>
  );
};
