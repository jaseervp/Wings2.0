import { useState } from 'react';
import { Check, Edit2, TrendingUp, Users, DollarSign, Activity, CreditCard, ArrowRight, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const PLANS = [
  { name: 'Free Tier', price: '₹0', period: '/forever', users: '1,245', color: 'blue', features: ['Basic Child Profile', 'Limited Info Hub Access', 'Community Forum'] },
  { name: 'Pro Plan', price: '₹499', period: '/month', users: '842', color: 'emerald', features: ['Preliminary Assessments', 'Custom Diet Plans', 'Exercise Video Library', 'Priority Support'] },
  { name: 'Premium Care', price: '₹999', period: '/month', users: '760', color: 'purple', features: ['Full Clinical IQ Tests', 'Priority Consultations', 'Detailed Therapy Tracking', 'Dedicated Account Manager'] },
];

const AdminSubscriptions = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight flex items-center gap-3">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
               <CreditCard className="w-6 h-6" />
             </div>
             Subscriptions & Revenue
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Manage pricing tiers, analyze recurring revenue, and monitor churn.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-4 py-2 bg-white text-text text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-primary transition-all flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4 text-gray-500" /> Export Report
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Recurring', val: '₹14.2L', icon: DollarSign, trend: '+12%', isUp: true, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Annual Run Rate', val: '₹1.7Cr', icon: TrendingUp, trend: '+15%', isUp: true, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Avg Churn Rate', val: '2.4%', icon: Activity, trend: '-0.5%', isUp: false, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
          { label: 'New Signups (Mtd)', val: '142', icon: Users, trend: '+5%', isUp: true, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-gray-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
             
             <div className="flex justify-between items-start mb-4">
               <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} ${stat.border} border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                 <stat.icon className="w-5 h-5" />
               </div>
               <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md border ${stat.isUp && stat.label !== 'Avg Churn Rate' || (!stat.isUp && stat.label === 'Avg Churn Rate') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                 {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                 {stat.trend}
               </div>
             </div>
             
             <div>
               <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
               <h3 className="text-2xl font-mono font-black text-text tracking-tight">{stat.val}</h3>
             </div>
          </div>
        ))}
      </div>

      {/* Plans */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500"></div>
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-xl font-admin-heading font-black text-text">Subscription Plans</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Manage active billing tiers and associated feature flags.</p>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
           {PLANS.map((plan, i) => (
             <div key={i} className={`bg-white border rounded-2xl p-7 relative flex flex-col hover:shadow-lg transition-all group ${
               plan.color === 'blue' ? 'border-blue-200 hover:border-blue-400' : 
               plan.color === 'emerald' ? 'border-emerald-200 hover:border-emerald-400 ring-2 ring-emerald-500/20' : 
               'border-purple-200 hover:border-purple-400'
             }`}>
                {plan.color === 'emerald' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">Most Popular</div>
                )}
                
                <button className="absolute top-5 right-5 p-2 text-gray-400 hover:text-primary bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100">
                  <Edit2 className="w-4 h-4" />
                </button>
                
                <h4 className="font-admin-heading font-black text-text text-xl mb-1">{plan.name}</h4>
                
                <div className="mt-4 flex items-baseline gap-1 text-admin-bg">
                  <span className="text-4xl font-mono font-black tracking-tight">{plan.price}</span>
                  <span className="text-sm font-bold text-gray-500">{plan.period}</span>
                </div>
                
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 w-fit px-3 py-1.5 rounded-lg shadow-sm">
                   <Users className="w-4 h-4 text-primary" /> {plan.users} Active Users
                </div>
                
                <div className="mt-8 flex-1 space-y-4">
                   <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Included Features</p>
                   {plan.features.map((feat, fIdx) => (
                     <div key={fIdx} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                        <div className={`mt-0.5 rounded-full p-0.5 ${
                          plan.color === 'blue' ? 'bg-blue-100 text-blue-600' : 
                          plan.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 
                          'bg-purple-100 text-purple-600'
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        {feat}
                     </div>
                   ))}
                </div>
                
                <button className={`mt-8 w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                  plan.color === 'emerald' ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20' : 
                  'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary hover:border-blue-200'
                }`}>
                  Manage Plan <ArrowRight className="w-4 h-4" />
                </button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
