import React, { useState, useEffect } from 'react';
import { 
  X, UtensilsCrossed, Plus, Trash2, CheckCircle2, AlertTriangle, 
  Loader2, Save, ArrowRight, User, Baby, ShieldAlert, Sparkles 
} from 'lucide-react';
import { adminDietApi } from '../services/adminDietApi';

const AGE_PRESETS = [
  { label: 'Infants (0-1 Yrs)', min: 0, max: 1, preset: 'Infants' },
  { label: 'Toddlers (1-3 Yrs)', min: 1, max: 3, preset: 'Toddlers' },
  { label: 'Preschool (3-6 Yrs)', min: 3, max: 6, preset: 'Preschool' },
  { label: 'School Age (7-12 Yrs)', min: 7, max: 12, preset: 'School Age' },
  { label: 'Adolescents (13-18 Yrs)', min: 13, max: 18, preset: 'Adolescents' },
  { label: 'Custom Range', min: 0, max: 18, preset: 'Custom' },
];

const COMMON_ALLERGENS = [
  'Peanuts', 'Dairy', 'Gluten', 'Eggs', 'Soy', 'Nuts', 'Seafood', 'Dust', 'Artificial Colors'
];

export const CreateDietTemplateModal = ({ isOpen, onClose, onSuccess }) => {
  const [section, setSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [foods, setFoods] = useState([]);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General Nutrition');
  const [status, setStatus] = useState('ACTIVE');
  const [iconBg, setIconBg] = useState('bg-emerald-50');
  const [iconColor, setIconColor] = useState('text-emerald-600');

  // Age group
  const [selectedPreset, setSelectedPreset] = useState('Preschool');
  const [minAge, setMinAge] = useState(3);
  const [maxAge, setMaxAge] = useState(6);
  const [ageUnit, setAgeUnit] = useState('Years');

  // Meal Slots
  const [mealSlots, setMealSlots] = useState([
    { name: 'Breakfast', foods: [{ foodName: 'Oatmeal', portion: '1 cup', allergens: ['Gluten'] }] },
    { name: 'Lunch', foods: [{ foodName: 'Grilled Chicken Breast', portion: '100 g', allergens: [] }] },
    { name: 'Dinner', foods: [{ foodName: 'Sweet Potato Mash', portion: '150 g', allergens: [] }] },
  ]);

  // Allergens & Restrictions
  const [excludedAllergens, setExcludedAllergens] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState(['Nutrient-Dense']);
  const [customRestriction, setCustomRestriction] = useState('');

  // Assignment Mode
  const [assignmentMode, setAssignmentMode] = useState('TEMPLATE_ONLY');
  const [availableChildren, setAvailableChildren] = useState([]);
  const [selectedChildIds, setSelectedChildIds] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFoods();
      resetForm();
    }
  }, [isOpen]);

  const loadFoods = async () => {
    try {
      const res = await adminDietApi.getFoods();
      if (res.success && res.data) setFoods(res.data);
    } catch (err) {
      console.error('Failed to load foods:', err);
    }
  };

  const resetForm = () => {
    setSection(1);
    setName('');
    setDescription('');
    setCategory('General Nutrition');
    setStatus('ACTIVE');
    setIconBg('bg-emerald-50');
    setIconColor('text-emerald-600');
    setSelectedPreset('Preschool');
    setMinAge(3);
    setMaxAge(6);
    setExcludedAllergens([]);
    setDietaryRestrictions(['Nutrient-Dense']);
    setAssignmentMode('TEMPLATE_ONLY');
    setSelectedChildIds([]);
  };

  const handlePresetChange = (presetName) => {
    setSelectedPreset(presetName);
    const found = AGE_PRESETS.find((p) => p.preset === presetName);
    if (found && presetName !== 'Custom') {
      setMinAge(found.min);
      setMaxAge(found.max);
    }
  };

  const addMealSlot = () => {
    setMealSlots((prev) => [
      ...prev,
      { name: `Snack ${prev.length + 1}`, foods: [{ foodName: '', portion: '1 serving', allergens: [] }] },
    ]);
  };

  const removeMealSlot = (index) => {
    setMealSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMealSlotName = (index, newName) => {
    setMealSlots((prev) => {
      const copy = [...prev];
      copy[index].name = newName;
      return copy;
    });
  };

  const addFoodToSlot = (slotIndex) => {
    setMealSlots((prev) => {
      const copy = [...prev];
      copy[slotIndex].foods.push({ foodName: '', portion: '1 serving', allergens: [] });
      return copy;
    });
  };

  const updateFoodInSlot = (slotIndex, foodIndex, field, value) => {
    setMealSlots((prev) => {
      const copy = [...prev];
      copy[slotIndex].foods[foodIndex][field] = value;
      // If food was selected from database, also populate allergens
      if (field === 'foodName') {
        const foundFood = foods.find((f) => f.name.toLowerCase() === value.toLowerCase());
        if (foundFood && foundFood.allergens) {
          copy[slotIndex].foods[foodIndex].allergens = foundFood.allergens;
        }
      }
      return copy;
    });
  };

  const removeFoodFromSlot = (slotIndex, foodIndex) => {
    setMealSlots((prev) => {
      const copy = [...prev];
      copy[slotIndex].foods = copy[slotIndex].foods.filter((_, i) => i !== foodIndex);
      return copy;
    });
  };

  const toggleAllergen = (allergen) => {
    setExcludedAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen],
    );
  };

  const addRestriction = () => {
    if (customRestriction.trim() && !dietaryRestrictions.includes(customRestriction.trim())) {
      setDietaryRestrictions((prev) => [...prev, customRestriction.trim()]);
      setCustomRestriction('');
    }
  };

  const removeRestriction = (item) => {
    setDietaryRestrictions((prev) => prev.filter((r) => r !== item));
  };

  const handleSaveTemplate = async () => {
    if (!name.trim()) {
      alert('Please enter a diet plan name');
      return;
    }
    if (minAge > maxAge) {
      alert('Minimum age cannot exceed maximum age');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: name.trim(),
        description: description.trim(),
        category,
        minAge: Number(minAge),
        maxAge: Number(maxAge),
        ageUnit,
        ageGroupPreset: selectedPreset,
        mealSlots,
        dietaryRestrictions,
        excludedAllergens,
        assignmentMode,
        automaticAssignmentEnabled: assignmentMode === 'AUTOMATIC',
        status,
        iconBg,
        iconColor,
        selectedChildIds: assignmentMode === 'MANUAL' ? selectedChildIds : [],
      };

      const res = await adminDietApi.createTemplate(payload);
      if (res.success) {
        if (onSuccess) onSuccess(`Diet template "${name}" created successfully`);
        onClose();
      }
    } catch (err) {
      console.error('Failed to create template:', err);
      alert(err.message || 'Failed to save diet template');
    } finally {
      setLoading(false);
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
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-black text-text tracking-tight">
                Create New Diet Template
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Configure nutritional meals, age boundaries, allergy exclusions, and patient assignments.
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

        {/* Section Steps Navigation */}
        <div className="flex items-center gap-2 py-3 border-b border-gray-100 overflow-x-auto shrink-0 font-medium text-xs">
          {[
            { num: 1, label: '1. Basic Info' },
            { num: 2, label: '2. Age Group' },
            { num: 3, label: '3. Meal Builder' },
            { num: 4, label: '4. Allergens' },
            { num: 5, label: '5. Assignment' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setSection(s.num)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                section === s.num
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-500 hover:text-text hover:bg-gray-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1 custom-scrollbar">
          
          {/* SECTION 1: BASIC INFORMATION */}
          {section === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Standard Auto-Immune Protocol, High Calorie Weight Gain"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief clinical overview of intended dietary goals and texture requirements..."
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                    Diet Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:border-primary outline-none"
                  >
                    <option value="General Nutrition">General Nutrition</option>
                    <option value="Allergy-Aware">Allergy-Aware</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Dairy-Free">Dairy-Free</option>
                    <option value="Low Sugar">Low Sugar Focus</option>
                    <option value="High Calorie">High Calorie Weight Gain</option>
                    <option value="Sensory Friendly">Sensory Friendly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                    Card Theme Style
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {[
                      { bg: 'bg-emerald-50', color: 'text-emerald-600', label: 'Green' },
                      { bg: 'bg-blue-50', color: 'text-blue-600', label: 'Blue' },
                      { bg: 'bg-amber-50', color: 'text-amber-600', label: 'Amber' },
                      { bg: 'bg-purple-50', color: 'text-purple-600', label: 'Purple' },
                    ].map((theme, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setIconBg(theme.bg);
                          setIconColor(theme.color);
                        }}
                        className={`w-8 h-8 rounded-xl ${theme.bg} ${theme.color} border flex items-center justify-center font-bold text-xs cursor-pointer ${
                          iconBg === theme.bg ? 'ring-2 ring-primary ring-offset-1 border-primary' : 'border-gray-200'
                        }`}
                      >
                        ✓
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: AGE GROUP */}
          {section === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-2">
                  Select Age Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {AGE_PRESETS.map((p) => (
                    <button
                      key={p.preset}
                      type="button"
                      onClick={() => handlePresetChange(p.preset)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedPreset === p.preset
                          ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-medium'
                      }`}
                    >
                      <p className="text-xs">{p.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-bold uppercase text-gray-500 font-mono mb-3">
                  Custom Age Boundaries (Years)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1">Minimum Age</label>
                    <input
                      type="number"
                      min={0}
                      max={18}
                      value={minAge}
                      onChange={(e) => {
                        setMinAge(Number(e.target.value));
                        setSelectedPreset('Custom');
                      }}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-text outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1">Maximum Age</label>
                    <input
                      type="number"
                      min={minAge}
                      max={18}
                      value={maxAge}
                      onChange={(e) => {
                        setMaxAge(Number(e.target.value));
                        setSelectedPreset('Custom');
                      }}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-text outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 font-mono">
                  Applied Target Range: <strong className="text-text">{minAge} - {maxAge} {ageUnit}</strong>
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: MEAL BUILDER */}
          {section === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium">
                  Configure daily meal slots and assign whole food items from the food database.
                </p>
                <button
                  type="button"
                  onClick={addMealSlot}
                  className="px-3 py-1.5 bg-blue-50 text-primary border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Meal Slot
                </button>
              </div>

              <div className="space-y-3">
                {mealSlots.map((slot, sIdx) => (
                  <div key={sIdx} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={slot.name}
                        onChange={(e) => updateMealSlotName(sIdx, e.target.value)}
                        className="text-sm font-bold text-text bg-transparent border-b border-gray-200 focus:border-primary outline-none px-1 py-0.5"
                      />
                      <button
                        type="button"
                        onClick={() => removeMealSlot(sIdx)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Foods in slot */}
                    <div className="space-y-2">
                      {slot.foods.map((food, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200">
                          <input
                            type="text"
                            list="food-suggestions"
                            value={food.foodName}
                            onChange={(e) => updateFoodInSlot(sIdx, fIdx, 'foodName', e.target.value)}
                            placeholder="Food item name..."
                            className="flex-1 text-xs font-medium bg-transparent outline-none px-2"
                          />
                          <input
                            type="text"
                            value={food.portion}
                            onChange={(e) => updateFoodInSlot(sIdx, fIdx, 'portion', e.target.value)}
                            placeholder="Portion (e.g. 1 cup)"
                            className="w-28 text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeFoodFromSlot(sIdx, fIdx)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addFoodToSlot(sIdx)}
                        className="text-[11px] font-bold text-primary hover:text-blue-800 flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Food to {slot.name}
                      </button>
                    </div>
                  </div>
                ))}

                <datalist id="food-suggestions">
                  {foods.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.category}
                    </option>
                  ))}
                </datalist>
              </div>
            </div>
          )}

          {/* SECTION 4: ALLERGENS & RESTRICTIONS */}
          {section === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-2">
                  Excluded Allergens (Safety Exclusions)
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_ALLERGENS.map((allergen) => {
                    const active = excludedAllergens.includes(allergen);
                    return (
                      <button
                        key={allergen}
                        type="button"
                        onClick={() => toggleAllergen(allergen)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          active
                            ? 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-200 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {active ? `✕ ${allergen}` : `+ ${allergen}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-2">
                  Dietary Restriction Badges
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {dietaryRestrictions.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeRestriction(item)}
                        className="text-emerald-500 hover:text-emerald-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 max-w-sm">
                  <input
                    type="text"
                    value={customRestriction}
                    onChange={(e) => setCustomRestriction(e.target.value)}
                    placeholder="Add restriction (e.g. Sugar-Free)"
                    className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={addRestriction}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: ASSIGNMENT MODE */}
          {section === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-2">
                Choose Assignment Mode
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    mode: 'TEMPLATE_ONLY',
                    title: 'Save Template Only',
                    desc: 'Store in template library for future manual or clinical assignments.',
                  },
                  {
                    mode: 'MANUAL',
                    title: 'Manual Patient Assignment',
                    desc: 'Select specific children from database now with allergy conflict checks.',
                  },
                  {
                    mode: 'AUTOMATIC',
                    title: 'Automatic Engine Assignment',
                    desc: 'Automatically assign to all matching age children without conflicts.',
                  },
                ].map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setAssignmentMode(item.mode)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      assignmentMode === item.mode
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <p className={`text-xs font-bold mb-1 ${assignmentMode === item.mode ? 'text-primary' : 'text-text'}`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>

              {assignmentMode === 'AUTOMATIC' && (
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 leading-relaxed font-medium">
                    The automatic engine will evaluate all active registered children. Any child with documented allergy conflicts or outside the configured age range (<strong>{minAge}-{maxAge} {ageUnit}</strong>) will be protected and excluded automatically.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {section > 1 && (
              <button
                type="button"
                onClick={() => setSection((prev) => prev - 1)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Back
              </button>
            )}
            {section < 5 && (
              <button
                type="button"
                onClick={() => setSection((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-100 text-text rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveTemplate}
            disabled={loading}
            className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Diet Template
          </button>
        </div>
      </div>
    </div>
  );
};
