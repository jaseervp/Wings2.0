import { useState } from 'react';
import { Download, AlertTriangle, Coffee, Sun, Moon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AGE_GROUPS = ['2-3 yrs', '4-5 yrs', '6-8 yrs'];
const MEALS = {
  breakfast: [
    { name: "Oatmeal with Mashed Banana", qty: "1 bowl", note: "Soft texture, high iron", icon: "🥣" },
    { name: "Boiled Egg (yolk only if allergy)", qty: "1 small", note: "Protein source", icon: "🥚" }
  ],
  lunch: [
    { name: "Lentil Soup (Dal)", qty: "1 small bowl", note: "Easy to digest", icon: "🍲" },
    { name: "Soft Cooked Rice", qty: "1/2 cup", note: "Energy source", icon: "🍚" },
    { name: "Steamed Carrot Sticks", qty: "4 sticks", note: "Vitamin A", icon: "🥕" }
  ],
  dinner: [
    { name: "Mashed Sweet Potato", qty: "1/2 cup", note: "Calming complex carbs", icon: "🍠" },
    { name: "Warm Milk", qty: "1 glass", note: "Before bed", icon: "🥛" }
  ]
};

const CHART_DATA = [
  { name: 'Grains', target: 100, actual: 85 },
  { name: 'Veggies', target: 100, actual: 60 },
  { name: 'Fruits', target: 100, actual: 110 },
  { name: 'Protein', target: 100, actual: 90 },
  { name: 'Dairy', target: 100, actual: 100 },
];

const DietPlan = () => {
  const [activeAge, setActiveAge] = useState('2-3 yrs');

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-heading font-extrabold text-primary mb-4">Therapeutic Diet Plan</h2>
          <div className="flex bg-gray-100 p-1.5 rounded-full inline-flex">
            {AGE_GROUPS.map(age => (
              <button 
                key={age}
                onClick={() => setActiveAge(age)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeAge === age ? 'bg-white text-text shadow-sm' : 'text-muted hover:text-text'}`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
        <button className="px-6 py-3 bg-primary/10 text-primary rounded-full font-bold hover:bg-primary/20 transition-all flex items-center gap-2 border border-primary/10">
          <Download className="w-5 h-5" /> Download PDF
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Weekly/Daily Meals Planner */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
             <h3 className="font-heading font-bold text-2xl text-text">Today's Meals</h3>
             <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full">Thursday</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* Breakfast */}
            <div className="bg-white rounded-3xl p-6 border-t-4 border-t-secondary shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-6">
                <Coffee className="w-6 h-6 text-secondary" />
                <h4 className="font-bold text-lg text-text">Breakfast</h4>
              </div>
              <div className="space-y-4">
                {MEALS.breakfast.map((m, i) => (
                  <div key={i} className="group cursor-default">
                    <p className="font-bold flex items-center gap-2"><span className="text-xl">{m.icon}</span> {m.name}</p>
                    <p className="text-sm text-secondary font-bold mt-1">{m.qty}</p>
                    <p className="text-xs text-muted mt-1 bg-gray-50 p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity">{m.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lunch */}
            <div className="bg-white rounded-3xl p-6 border-t-4 border-t-primary shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-6">
                <Sun className="w-6 h-6 text-primary" />
                <h4 className="font-bold text-lg text-text">Lunch</h4>
              </div>
              <div className="space-y-4">
                {MEALS.lunch.map((m, i) => (
                   <div key={i} className="group cursor-default">
                   <p className="font-bold flex items-center gap-2"><span className="text-xl">{m.icon}</span> {m.name}</p>
                   <p className="text-sm text-primary font-bold mt-1">{m.qty}</p>
                   <p className="text-xs text-muted mt-1 bg-gray-50 p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity">{m.note}</p>
                 </div>
                ))}
              </div>
            </div>

            {/* Dinner */}
            <div className="bg-white rounded-3xl p-6 border-t-4 border-t-accent shadow-sm hover:shadow-md transition-all">
               <div className="flex items-center gap-3 mb-6">
                <Moon className="w-6 h-6 text-accent" />
                <h4 className="font-bold text-lg text-text">Dinner</h4>
              </div>
              <div className="space-y-4">
                {MEALS.dinner.map((m, i) => (
                  <div key={i} className="group cursor-default">
                  <p className="font-bold flex items-center gap-2"><span className="text-xl">{m.icon}</span> {m.name}</p>
                  <p className="text-sm text-accent font-bold mt-1">{m.qty}</p>
                  <p className="text-xs text-muted mt-1 bg-gray-50 p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity">{m.note}</p>
                </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics & Warnings */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <h4 className="font-heading font-bold text-lg text-text mb-6">Nutritional Target vs Actual</h4>
             <div className="h-[250px] w-full text-xs font-bold">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={CHART_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -25 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                   <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                   <Bar dataKey="target" fill="#E2E8F0" radius={[4, 4, 0, 0]} barSize={12} />
                   <Bar dataKey="actual" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={12} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 relative overflow-hidden">
             <div className="flex gap-4 items-start relative z-10">
               <div className="bg-red-100 p-2 rounded-full shrink-0">
                 <AlertTriangle className="w-6 h-6 text-red-600" />
               </div>
               <div>
                 <h4 className="font-bold text-red-800 text-lg mb-2">Foods to Restrict</h4>
                 <ul className="list-disc pl-4 space-y-1 text-sm text-red-700 font-medium">
                   <li>High-sugar fruits (e.g., Bananas, Figs)</li>
                   <li>Artificial colors / excessive sugar</li>
                   <li>Processed meats</li>
                 </ul>
                 <p className="text-xs text-red-600 mt-4 font-bold bg-white/50 inline-block px-2 py-1 rounded">May cause hyperactivity.</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlan;
