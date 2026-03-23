import { ArrowUpRight, ArrowDownRight, Users, Baby, Brain, Stethoscope, ShoppingBag, DollarSign, MoreVertical, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const STATS = [
  { label: 'Total Users', value: '2,847', trend: 12, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Active Children', value: '1,203', trend: 8, icon: Baby, color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'IQ Tests This Week', value: '148', trend: 23, icon: Brain, color: 'text-secondary', bg: 'bg-secondary/10' },
  { label: 'Therapists Online', value: '24', trend: 0, icon: Stethoscope, color: 'text-success', bg: 'bg-success/10' },
  { label: 'Store Orders', value: '67', trend: 5, icon: ShoppingBag, color: 'text-admin-warning', bg: 'bg-admin-warning/10' },
  { label: 'Revenue Today', value: '₹48,200', trend: 18, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
];

const AREA_DATA = [
  { name: 'Jan', parents: 400, children: 240 },
  { name: 'Feb', parents: 300, children: 139 },
  { name: 'Mar', parents: 200, children: 980 },
  { name: 'Apr', parents: 278, children: 390 },
  { name: 'May', parents: 189, children: 480 },
  { name: 'Jun', parents: 239, children: 380 },
];

const DONUT_DATA = [
  { name: 'Profound', value: 400, color: '#EF4444' },
  { name: 'Severe', value: 300, color: '#F59E0B' },
  { name: 'Moderate', value: 300, color: '#F76C6C' },
  { name: 'Mild', value: 200, color: '#6366F1' },
  { name: 'Borderline', value: 278, color: '#1A7F8E' },
];

const RECENT_USERS = [
  { id: 1, name: 'Priya Sharma', email: 'priya@email.com', children: 2, join: 'Today 10:45 AM', status: 'Active' },
  { id: 2, name: 'Rahul Varma', email: 'v.rahul@email.com', children: 1, join: 'Today 09:30 AM', status: 'Active' },
  { id: 3, name: 'Sneha M', email: 'sm@email.com', children: 3, join: 'Yesterday', status: 'Pending' },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-admin-surface rounded-xl p-5 shadow-sm border border-admin-border flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.trend !== 0 ? (
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${stat.trend > 0 ? 'text-success bg-success/10' : 'text-admin-danger bg-admin-danger/10'}`}>
                   {stat.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                   {Math.abs(stat.trend)}%
                </div>
              ) : (
                <div className="text-xs font-bold text-muted bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                  — 0%
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-muted font-bold tracking-wide">{stat.label}</p>
              <h3 className="text-2xl font-mono font-black text-text mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Charts Row */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* User Registration Trend Area Chart */}
        <div className="lg:col-span-3 bg-admin-surface rounded-xl shadow-sm border border-admin-border p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-admin-heading font-bold text-text">User Registration Trend</h3>
            <select className="bg-gray-50 border border-admin-border text-sm rounded-lg px-3 py-1.5 outline-none font-bold text-muted">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 min-h-[300px] text-xs font-mono font-bold">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={AREA_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorParents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorChildren" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-admin-border)" />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'Sora'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Area type="monotone" dataKey="parents" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorParents)" />
                <Area type="monotone" dataKey="children" stroke="var(--color-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorChildren)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* IQ Score Distribution */}
        <div className="lg:col-span-2 bg-admin-surface rounded-xl shadow-sm border border-admin-border p-6 flex flex-col">
           <div className="flex justify-between items-center mb-6">
            <h3 className="font-admin-heading font-bold text-text">IQ Score Distribution</h3>
          </div>
          <div className="flex-1 min-h-[300px] relative text-xs font-bold font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DONUT_DATA} innerRadius={80} outerRadius={110} paddingAngle={2} dataKey="value">
                  {DONUT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-mono font-black text-text">1.4k</span>
              <span className="text-xs font-bold text-muted">Total Tests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row (Placeholder tables) */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-admin-surface rounded-xl shadow-sm border border-admin-border flex flex-col">
          <div className="p-6 border-b border-admin-border flex justify-between items-center">
            <h3 className="font-admin-heading font-bold text-text">Recent Registrations</h3>
            <button className="text-sm font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-admin-border text-xs uppercase tracking-wider text-muted font-bold font-mono">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Children</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium divide-y divide-admin-border">
                {RECENT_USERS.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-text">{user.name}</p>
                          <p className="text-xs text-muted font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-muted">{user.children}</td>
                    <td className="px-6 py-4 text-muted text-xs font-bold">{user.join}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 rounded hover:bg-gray-200 text-muted transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-admin-surface rounded-xl shadow-sm border border-admin-border flex flex-col">
          <div className="p-6 border-b border-admin-border">
            <h3 className="font-admin-heading font-bold text-text flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-admin-warning" /> Pending Actions
            </h3>
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="flex gap-4 items-start pb-4 border-b border-admin-border border-dashed">
              <div className="w-2 h-2 rounded-full bg-admin-danger mt-2 shrink-0"></div>
              <div>
                <p className="font-bold text-sm text-text leading-tight">Review Flagged Assessment</p>
                <p className="text-xs text-muted mt-1">Aarav M. (Age 4) scored concerningly low on social markers.</p>
                <button className="mt-2 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary/20 transition-colors">Review Now</button>
              </div>
            </div>
            <div className="flex gap-4 items-start pb-4 border-b border-admin-border border-dashed">
              <div className="w-2 h-2 rounded-full bg-admin-warning mt-2 shrink-0"></div>
              <div>
                <p className="font-bold text-sm text-text leading-tight">Therapist Approval</p>
                <p className="text-xs text-muted mt-1">Dr. Sreelakshmi uploaded license certificates.</p>
                <button className="mt-2 text-xs font-bold text-admin-warning bg-admin-warning/10 px-2 py-1 rounded hover:bg-admin-warning/20 transition-colors">Verify Documents</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
