import { useState } from 'react';
import { Save, Shield, Mail, CreditCard, Bot, Upload } from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = [
    { id: 'General', icon: Shield },
    { id: 'Roles & Permissions', icon: Shield },
    { id: 'Email Templates', icon: Mail },
    { id: 'Payment Gateway', icon: CreditCard },
    { id: 'AI Configuration', icon: Bot },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-admin-heading font-extrabold text-admin-bg">System Settings</h2>
           <p className="text-muted font-medium text-sm mt-1">Configure global application parameters, integrations, and access control.</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2">
           <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
         {/* Sidebar Navigation */}
         <div className="w-full md:w-64 shrink-0 flex flex-col gap-1">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-primary shadow-sm border border-admin-border hover:border-primary/30' : 'text-muted hover:bg-white/60 border border-transparent hover:text-text'}`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary' : 'text-gray-400'}`} /> {tab.id}
              </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="flex-1 bg-admin-surface rounded-xl shadow-sm border border-admin-border p-6 min-h-[500px]">
            {activeTab === 'General' && (
               <div className="space-y-6 max-w-2xl">
                 <h3 className="font-admin-heading font-bold text-text border-b border-admin-border pb-4">General Profile</h3>
                 
                 <div className="flex gap-6 items-start">
                    <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center border border-dashed border-gray-300 relative group overflow-hidden cursor-pointer">
                      <img src="/wings-icon.svg" alt="logo" className="w-12 h-12 opacity-50 grayscale" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                       <div>
                         <label className="block text-sm font-bold text-text mb-1.5">Application Name <span className="text-admin-danger">*</span></label>
                         <input type="text" defaultValue="Wings Mental Health" className="w-full bg-white border border-admin-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-sm font-bold text-text mb-1.5">Support Email</label>
                           <input type="email" defaultValue="support@wingsmentalhealth.in" className="w-full bg-white border border-admin-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                         </div>
                         <div>
                           <label className="block text-sm font-bold text-text mb-1.5">Support Phone</label>
                           <input type="tel" defaultValue="+91 1800-444-5555" className="w-full bg-white border border-admin-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 font-mono" />
                         </div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-admin-border grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-text mb-1.5">Default Timezone</label>
                      <select className="w-full bg-white border border-admin-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 font-bold text-muted">
                        <option>Asia/Kolkata (IST)</option>
                        <option>UTC Default</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text mb-1.5">Platform Language</label>
                      <select className="w-full bg-white border border-admin-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 font-bold text-muted">
                        <option>English (IN)</option>
                        <option>Hindi (HI)</option>
                      </select>
                    </div>
                 </div>
               </div>
            )}

            {activeTab === 'AI Configuration' && (
               <div className="space-y-6 max-w-2xl">
                 <h3 className="font-admin-heading font-bold text-text border-b border-admin-border pb-4 flex items-center gap-2"><Bot className="w-5 h-5 text-accent" /> AI Generation Models</h3>
                 
                 <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-text mb-1.5">OpenAI API Key</label>
                      <div className="flex gap-2">
                        <input type="password" defaultValue="sk-proj-....................." className="w-full bg-white border border-admin-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 font-mono" />
                        <button className="px-4 py-2 bg-gray-100 text-muted hover:text-text rounded-lg border border-admin-border font-bold text-sm">Verify</button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-admin-border">
                       <label className="flex items-center justify-between p-4 border border-admin-border rounded-xl cursor-pointer hover:border-primary/30 transition-colors">
                         <div>
                            <p className="font-bold text-text">Automated IQ Analysis</p>
                            <p className="text-xs text-muted mt-1">Use AI to generate textual recommendations from IQ test matrix scores.</p>
                         </div>
                         <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                       </label>
                    </div>

                    <div>
                       <label className="flex items-center justify-between p-4 border border-admin-border rounded-xl cursor-pointer hover:border-primary/30 transition-colors">
                         <div>
                            <p className="font-bold text-text">Dietary AI Suggestions</p>
                            <p className="text-xs text-muted mt-1">Suggest weekly meals matching medical flags in preliminary assessments.</p>
                         </div>
                         <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                       </label>
                    </div>
                 </div>
               </div>
            )}

            {/* Placeholder for other tabs */}
            {!['General', 'AI Configuration'].includes(activeTab) && (
              <div className="h-full flex flex-col items-center justify-center text-muted font-medium pt-20">
                <tab.icon className="w-12 h-12 text-gray-200 mb-4" />
                <p>Configuration panel for {activeTab}</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default AdminSettings;
