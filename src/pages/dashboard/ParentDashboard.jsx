import { Link } from 'react-router-dom';
import { Activity, Calendar, Play, ChartBar, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Jan', score: 45 },
  { name: 'Feb', score: 48 },
  { name: 'Mar', score: 55 },
  { name: 'Apr', score: 58 },
  { name: 'May', score: 62 },
];

const ParentDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Current IQ Score', value: '62', trend: '+4 this month', color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Therapy Sessions', value: '14', trend: '2 remaining', color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'Diet Compliance', value: '85%', trend: 'Looking good!', color: 'text-success', bg: 'bg-success/10' },
          { label: 'Next Appt.', value: '12 May', trend: 'Dr. Sarah', color: 'text-secondary', bg: 'bg-secondary/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <h4 className="text-sm font-bold text-muted mb-4">{stat.label}</h4>
            <div className="flex items-end justify-between mt-auto">
              <span className={`text-3xl font-heading font-black ${stat.color}`}>{stat.value}</span>
              <span className="text-xs font-semibold text-text bg-gray-50 px-2 py-1 rounded-md">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-xl text-text">IQ Progress</h3>
            <button className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
              Full Report
            </button>
          </div>
          <div className="h-64 mt-4 text-sm font-medium">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1E293B' }}
                />
                <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={4} dot={{ r: 6, fill: '#fff', strokeWidth: 3 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reminders & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-heading font-bold text-lg mb-4 text-text flex items-center gap-2">
              <Calendar className="h-5 w-5 text-secondary" /> Upcoming
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex flex-col items-center justify-center text-accent">
                  <span className="text-xs font-bold leading-none">MAY</span>
                  <span className="text-lg font-black leading-none">12</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Speech Therapy</h4>
                  <p className="text-xs text-muted">10:00 AM - Video Call</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex flex-col items-center justify-center text-success">
                  <span className="text-xs font-bold leading-none">MAY</span>
                  <span className="text-lg font-black leading-none">14</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Diet Review</h4>
                  <p className="text-xs text-muted">02:30 PM - Dr. Sarah</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <Link to="/assessment" className="bg-primary hover:bg-primary/90 text-white rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 shadow-md shadow-primary/20">
               <Activity className="h-6 w-6" />
               <span className="text-xs font-bold text-center">Start<br/>Assessment</span>
             </Link>
             <Link to="/diet-plan" className="bg-secondary hover:bg-secondary/90 text-white rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 shadow-md shadow-secondary/20">
               <AppleIcon className="h-6 w-6" />
               <span className="text-xs font-bold text-center">View<br/>Diet Plan</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

function AppleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </svg>
  );
}

export default ParentDashboard;
