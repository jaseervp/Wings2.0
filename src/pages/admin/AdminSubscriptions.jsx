import { useState } from 'react';
import { Check, Edit2, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const PLANS = [
  { name: 'Free', price: '₹0', users: '1,245', features: ['Basic Profile', 'Info Hub Access'] },
  { name: 'Pro', price: '₹499/mo', users: '842', features: ['Preliminary Assessments', 'Diet Plans', 'Exercise Videos'] },
  { name: 'Premium', price: '₹999/mo', users: '760', features: ['Full IQ Tests', 'Priority Consultations', 'Therapy Tracking'] },
];

const AdminSubscriptions = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">Subscriptions</h2>
           <p className="text-muted font-medium text-sm mt-1">Manage pricing tiers and monitor recurring revenue.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'MRR', val: '₹14.2L', icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
          { label: 'ARR', val: '₹1.7Cr', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Churn Rate', val: '2.4%', icon: Activity, color: 'text-admin-danger', bg: 'bg-admin-danger/10' },
          { label: 'New This Month', val: '142', icon: Users, color: 'text-accent', bg: 'bg-accent/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-admin-surface rounded-xl shadow-sm border border-admin-border p-5 flex items-center gap-4">
             <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
               <stat.icon className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs text-muted font-bold uppercase tracking-wide">{stat.label}</p>
               <h3 className="text-2xl font-mono font-black text-text mt-0.5">{stat.val}</h3>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border p-6">
        <h3 className="font-admin-heading font-bold text-text mb-6">Subscription Plans</h3>
        <div className="grid lg:grid-cols-3 gap-6">
           {PLANS.map((plan, i) => (
             <div key={i} className="border border-admin-border rounded-xl p-6 relative flex flex-col hover:border-primary/50 transition-colors">
                <button className="absolute top-4 right-4 p-2 text-muted hover:text-primary transition-colors bg-gray-50 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <h4 className="font-bold text-text text-lg">{plan.name}</h4>
                <div className="mt-2 text-3xl font-mono font-black text-admin-bg">{plan.price}</div>
                <div className="mt-4 flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 w-fit px-2 py-1 rounded">
                   <Users className="w-4 h-4" /> {plan.users} Active Users
                </div>
                
                <div className="mt-6 flex-1 space-y-3">
                   {plan.features.map((feat, fIdx) => (
                     <div key={fIdx} className="flex items-center gap-3 text-sm text-text font-medium">
                        <Check className="w-4 h-4 text-success" /> {feat}
                     </div>
                   ))}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
