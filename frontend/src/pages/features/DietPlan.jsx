import { useState } from 'react';
import { 
  Download, AlertTriangle, Coffee, Sun, Moon, Apple, 
  Flame, Calendar, Activity, Bot, CheckCircle2, Circle, Droplets,
  TrendingUp, Award, Target
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const MEALS = {
  breakfast: [
    { id: 'b1', name: "Oatmeal with Mashed Banana", calories: 250, benefits: "High iron, easy digestion", completed: true },
    { id: 'b2', name: "Boiled Egg", calories: 70, benefits: "Brain-boosting protein", completed: true }
  ],
  lunch: [
    { id: 'l1', name: "Lentil Soup (Dal)", calories: 180, benefits: "Complex carbs, protein", completed: false },
    { id: 'l2', name: "Soft Cooked Rice", calories: 150, benefits: "Sustained energy", completed: false },
    { id: 'l3', name: "Steamed Carrot Sticks", calories: 45, benefits: "Vitamin A for vision", completed: false }
  ],
  snack: [
    { id: 's1', name: "Greek Yogurt with Blueberries", calories: 120, benefits: "Probiotics, antioxidants", completed: false }
  ],
  dinner: [
    { id: 'd1', name: "Mashed Sweet Potato", calories: 110, benefits: "Calming complex carbs", completed: false },
    { id: 'd2', name: "Warm Milk", calories: 130, benefits: "Aids sleep", completed: false }
  ]
};

const NUTRITION_TARGETS = [
  { name: 'Protein', target: 100, actual: 85, color: 'bg-primary' },
  { name: 'Iron', target: 100, actual: 60, color: 'bg-accent' },
  { name: 'Calcium', target: 100, actual: 110, color: 'bg-success' },
  { name: 'Vitamins', target: 100, actual: 90, color: 'bg-secondary' },
  { name: 'Fiber', target: 100, actual: 75, color: 'bg-purple-500' },
];

const WEEKLY_DATA = [
  { day: 'Mon', score: 85 },
  { day: 'Tue', score: 88 },
  { day: 'Wed', score: 75 },
  { day: 'Thu', score: 92 },
  { day: 'Fri', score: 80 },
  { day: 'Sat', score: 95 },
  { day: 'Sun', score: 90 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const DietPlan = () => {
  const [mealStatus, setMealStatus] = useState(
    Object.values(MEALS).flat().reduce((acc, meal) => ({ ...acc, [meal.id]: meal.completed }), {})
  );

  const [checklist, setChecklist] = useState([
    { id: 1, text: "Breakfast Complete", done: true },
    { id: 2, text: "Give morning Multivitamin", done: true },
    { id: 3, text: "Water Intake (4 glasses)", done: false },
    { id: 4, text: "Lunch Complete", done: false },
    { id: 5, text: "Dinner & Evening Routine", done: false },
  ]);

  const toggleMeal = (id) => {
    setMealStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleChecklist = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  const totalMeals = Object.keys(mealStatus).length;
  const completedMeals = Object.values(mealStatus).filter(Boolean).length;
  const progressPercent = Math.round((completedMeals / totalMeals) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-heading font-extrabold text-primary mb-2">Nutrition Plan</h2>
          <p className="text-muted font-medium">Therapeutic diet tailored for Aarav's development</p>
        </div>
        <button className="px-6 py-3 bg-white text-primary rounded-[1rem] font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 border border-primary/10">
          <Download className="w-5 h-5" /> Download PDF
        </button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* 1. Nutrition Hero */}
        <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 sm:p-10 border border-white bg-gradient-to-br from-success/90 to-teal-600 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-success/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -ml-20 -mb-20" />
          
          <div className="relative z-10 flex items-center gap-6">
            <div className="relative">
              <img 
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Aarav&backgroundColor=ffffff" 
                alt="Aarav" 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/30 shadow-lg bg-white"
              />
              <div className="absolute -bottom-2 -right-2 bg-white text-success font-black text-xs px-2 py-1 rounded-lg shadow-sm border border-success/20">
                {progressPercent}%
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-bold mb-3 shadow-sm">
                <Target className="w-4 h-4" /> Daily Goal: 1,200 kcal
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold mb-1">Aarav's Nutrition</h2>
              <p className="text-teal-50 font-medium">Excellent start! Breakfast goals achieved.</p>
            </div>
          </div>
          
          <div className="relative z-10 flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
              <Flame className="w-8 h-8 text-accent mb-2 drop-shadow-sm" />
              <span className="text-2xl font-heading font-black">12 Days</span>
              <span className="text-xs text-teal-100 font-semibold uppercase tracking-wider">Diet Streak</span>
            </div>
            <div className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
              <Sun className="w-8 h-8 text-white mb-2 drop-shadow-sm" />
              <span className="text-xl font-heading font-black mt-1 text-center leading-tight">Lunch</span>
              <span className="text-xs text-teal-100 font-semibold uppercase tracking-wider mt-1">Next Meal</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 2. Meal Planner */}
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-end mb-6">
                <h3 className="font-heading font-extrabold text-2xl text-text">Today's Meals</h3>
                <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full">Thursday</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: "Breakfast", icon: Coffee, data: MEALS.breakfast, color: "text-secondary", border: "border-t-secondary", bg: "bg-secondary/10" },
                  { title: "Lunch", icon: Sun, data: MEALS.lunch, color: "text-primary", border: "border-t-primary", bg: "bg-primary/10" },
                  { title: "Snack", icon: Apple, data: MEALS.snack, color: "text-success", border: "border-t-success", bg: "bg-success/10" },
                  { title: "Dinner", icon: Moon, data: MEALS.dinner, color: "text-accent", border: "border-t-accent", bg: "bg-accent/10" }
                ].map((meal, i) => (
                  <div key={i} className={`glass rounded-[2rem] p-6 border-t-[6px] ${meal.border} border-x border-b border-white shadow-sm flex flex-col h-full`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-2.5 rounded-xl ${meal.bg} ${meal.color}`}>
                        <meal.icon className="w-6 h-6" />
                      </div>
                      <h4 className="font-heading font-bold text-xl text-text">{meal.title}</h4>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                      {meal.data.map((food) => {
                        const isDone = mealStatus[food.id];
                        return (
                          <div 
                            key={food.id}
                            onClick={() => toggleMeal(food.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-start gap-3
                              ${isDone ? 'bg-gray-50/50 border-gray-100 opacity-80' : 'bg-white border-white hover:border-gray-200 shadow-sm'}
                            `}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isDone 
                                ? <CheckCircle2 className={`w-5 h-5 ${meal.color}`} /> 
                                : <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
                              }
                            </div>
                            <div>
                              <p className={`font-bold text-sm leading-tight mb-1 transition-colors ${isDone ? 'text-muted line-through' : 'text-text'}`}>
                                {food.name}
                              </p>
                              <div className="flex items-center gap-2 text-xs font-semibold">
                                <span className={meal.color}>{food.calories} kcal</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-muted">{food.benefits}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 3 & 7. Nutrition Tracking & Weekly Progress */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-6 sm:p-8 border border-white flex flex-col">
                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-text">Nutritional Goals</h3>
                    <p className="text-sm text-muted">Daily macro & micro intake</p>
                  </div>
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="space-y-5 flex-1">
                  {NUTRITION_TARGETS.map((nutrient, i) => {
                    const percent = Math.min((nutrient.actual / nutrient.target) * 100, 100);
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm font-bold text-text mb-2">
                          <span>{nutrient.name}</span>
                          <span className="text-muted">{nutrient.actual}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            className={`h-full rounded-full ${nutrient.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-6 sm:p-8 border border-white flex flex-col">
                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-text">Weekly Trend</h3>
                    <p className="text-sm text-muted">Nutrition score consistency</p>
                  </div>
                  <div className="p-3 bg-success/10 text-success rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="flex-1 min-h-[200px] w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={WEEKLY_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#0F172A' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-8">
            
            {/* 4. AI Nutrition Coach */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <Bot className="w-40 h-40 text-indigo-600" />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm border border-indigo-200">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-indigo-900">AI Nutrition Coach</h3>
              </div>
              <p className="text-sm text-indigo-900/80 font-medium leading-relaxed relative z-10 mb-4">
                Aarav's iron intake is a bit low today. Try adding a small side of spinach to his dinner or serving orange juice to boost absorption!
              </p>
            </motion.div>

            {/* 8. Parent Checklist */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shadow-sm border border-blue-100">
                  <Droplets className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-text">Daily Checklist</h3>
              </div>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => toggleChecklist(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group
                      ${item.done 
                        ? 'bg-gray-50/50 border-gray-100 opacity-70' 
                        : 'bg-white border-white shadow-sm hover:border-primary/30 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="shrink-0 relative">
                      {item.done 
                        ? <CheckCircle2 className="w-6 h-6 text-primary" /> 
                        : <Circle className="w-6 h-6 text-gray-300 group-hover:text-primary/50 transition-colors" />
                      }
                    </div>
                    <span className={`font-semibold text-sm transition-all ${item.done ? 'text-muted line-through' : 'text-text'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 5. Brain Boost Foods */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-accent/10 rounded-xl text-accent shadow-sm border border-accent/20">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-text">Brain Boosters</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Blueberries", desc: "High in antioxidants, improves memory", color: "bg-purple-100 text-purple-700" },
                  { name: "Avocado", desc: "Healthy fats for brain blood flow", color: "bg-green-100 text-green-700" },
                  { name: "Salmon", desc: "Rich in Omega-3s for focus", color: "bg-orange-100 text-orange-700" }
                ].map((food, i) => (
                  <div key={i} className="flex flex-col gap-1 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md w-fit ${food.color}`}>{food.name}</span>
                    <span className="text-sm font-semibold text-text mt-1">{food.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 6. Foods To Limit */}
            <motion.div variants={itemVariants} className="bg-red-50/80 backdrop-blur-md rounded-[2.5rem] border border-red-100 p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="bg-red-100 p-2.5 rounded-xl text-red-600 shadow-sm border border-red-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-lg text-red-800">Foods to Limit</h4>
              </div>
              <ul className="space-y-3 relative z-10">
                <li className="flex items-start gap-2 text-sm text-red-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span>Artificial Colors (May cause hyperactivity)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-red-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span>Refined Sugars (Energy spikes & crashes)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-red-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span>Processed Meats (Inflammation)</span>
                </li>
              </ul>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DietPlan;
