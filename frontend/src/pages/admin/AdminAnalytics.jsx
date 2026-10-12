import { useState } from 'react';
import { Calendar, Download, TrendingUp, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const REV_DATA = [
  { name: 'Mon', subs: 4000, products: 2400 },
  { name: 'Tue', subs: 3000, products: 1398 },
  { name: 'Wed', subs: 2000, products: 9800 },
  { name: 'Thu', subs: 2780, products: 3908 },
  { name: 'Fri', subs: 1890, products: 4800 },
  { name: 'Sat', subs: 2390, products: 3800 },
  { name: 'Sun', subs: 3490, products: 4300 },
];

const FUNNEL_DATA = [
  { name: 'Registered', value: 1000 },
  { name: 'Assessment', value: 800 },
  { name: 'IQ Test', value: 600 },
  { name: 'Consultation', value: 200 },
];

const AdminAnalytics = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">Platform Analytics</h2>
           <p className="text-muted font-medium text-sm mt-1">Deep insights into user engagement, revenue, and clinical metrics.</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white border border-admin-border flex items-center rounded-lg shadow-sm px-3 py-2 text-sm font-bold text-muted cursor-pointer hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4 mr-2" /> Last 7 Days
           </div>
           <button className="px-4 py-2 border border-admin-border bg-white text-text text-sm font-bold rounded-lg shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Revenue Trend */}
        <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border p-6 flex flex-col">
           <div className="flex justify-between items-center mb-6">
            <h3 className="font-admin-heading font-bold text-text">Revenue Trend</h3>
          </div>
          <div className="flex-1 min-h-[300px] text-xs font-mono font-bold">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REV_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                   <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-admin-border)" />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'Sora'}} />
                <Area type="monotone" dataKey="subs" stackId="1" stroke="var(--color-primary)" fill="url(#colorSubs)" />
                <Area type="monotone" dataKey="products" stackId="1" stroke="var(--color-accent)" fill="url(#colorProds)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel */}
        <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border p-6 flex flex-col">
           <div className="flex justify-between items-center mb-6">
            <h3 className="font-admin-heading font-bold text-text">Assessment Funnel</h3>
          </div>
          <div className="flex-1 min-h-[300px] text-xs font-mono font-bold">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FUNNEL_DATA} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-admin-border)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#1E293B', fontWeight: 600, fontFamily: 'Sora'}} width={100} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={32}>
                  {FUNNEL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--color-admin-border)' : index === 3 ? 'var(--color-accent)' : 'var(--color-primary)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
