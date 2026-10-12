import { useState } from 'react';
import { Save, Shield, Mail, CreditCard, Bot, Upload, Settings, CheckCircle2, Globe, Building2, Bell } from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = [
    { id: 'General', icon: Settings, desc: 'App profile & localization' },
    { id: 'Roles & Permissions', icon: Shield, desc: 'Access control & security' },
    { id: 'Email Templates', icon: Mail, desc: 'Automated notifications' },
    { id: 'Payment Gateway', icon: CreditCard, desc: 'Billing & payouts' },
    { id: 'AI Configuration', icon: Bot, desc: 'LLM models & behavior' },
    { id: 'Integrations', icon: Globe, desc: 'Third-party services' },
    { id: 'Company Info', icon: Building2, desc: 'Legal & billing info' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight flex items-center gap-3">
             <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
               <Settings className="w-6 h-6" />
             </div>
             System Settings
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Configure global application parameters, integrations, and access control.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/30 hover:bg-primary/90 hover:shadow-md transition-all flex items-center gap-2">
             <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
         
         {/* Sidebar Navigation */}
         <div className="w-full md:w-72 shrink-0 flex flex-col gap-2">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-start gap-4 p-4 rounded-2xl transition-all text-left ${
                  activeTab === tab.id 
                  ? 'bg-white shadow-md border border-gray-200/60 ring-1 ring-primary/10 relative overflow-hidden group' 
                  : 'hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm text-gray-600'
                }`}
              >
                {activeTab === tab.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl"></div>
                )}
                <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                  activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                }`}>
                  <tab.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className={`font-bold text-sm ${activeTab === tab.id ? 'text-primary' : 'text-text'}`}>{tab.id}</div>
                  <div className="text-[11px] font-medium text-gray-500 mt-0.5">{tab.desc}</div>
                </div>
              </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 w-full overflow-hidden">
            
            {activeTab === 'General' && (
               <div className="animate-in fade-in duration-300">
                 <div className="p-6 md:p-8 border-b border-gray-100">
                   <h3 className="text-xl font-admin-heading font-black text-text">General Profile</h3>
                   <p className="text-sm text-gray-500 font-medium mt-1">Manage your platform's public-facing information.</p>
                 </div>
                 
                 <div className="p-6 md:p-8 space-y-8 max-w-3xl">
                   {/* Logo Upload */}
                   <div className="flex flex-col sm:flex-row gap-8 items-start">
                      <div className="w-28 h-28 rounded-3xl bg-gray-50 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 relative group overflow-hidden cursor-pointer hover:border-primary/50 hover:bg-blue-50/30 transition-colors shrink-0">
                        <img src="/wings-icon.svg" alt="logo" className="w-12 h-12 opacity-40 grayscale group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-primary/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                          <Upload className="w-6 h-6 text-white mb-1" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Update Logo</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-5 w-full">
                         <div>
                           <label className="block text-sm font-bold text-text mb-2">Platform Name <span className="text-red-500">*</span></label>
                           <input type="text" defaultValue="Wings Mental Health" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" />
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                           <div>
                             <label className="block text-sm font-bold text-text mb-2">Support Email</label>
                             <input type="email" defaultValue="support@wingsmentalhealth.in" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" />
                           </div>
                           <div>
                             <label className="block text-sm font-bold text-text mb-2">Support Phone</label>
                             <input type="tel" defaultValue="+91 1800-444-5555" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-mono" />
                           </div>
                         </div>
                      </div>
                   </div>
                   
                   <hr className="border-gray-100" />

                   {/* Localization */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-text mb-2">Default Timezone</label>
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm cursor-pointer appearance-none">
                          <option>Asia/Kolkata (IST)</option>
                          <option>UTC Default</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text mb-2">Platform Language</label>
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm cursor-pointer appearance-none">
                          <option>English (IN)</option>
                          <option>Hindi (HI)</option>
                        </select>
                      </div>
                   </div>
                 </div>
               </div>
            )}

            {activeTab === 'AI Configuration' && (
               <div className="animate-in fade-in duration-300">
                 <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
                   <div>
                     <h3 className="text-xl font-admin-heading font-black text-text flex items-center gap-2">
                       <Bot className="w-5 h-5 text-purple-600" /> AI Generation Models
                     </h3>
                     <p className="text-sm text-gray-500 font-medium mt-1">Configure LLM providers and automated behavior features.</p>
                   </div>
                   <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg shadow-sm">
                     <CheckCircle2 className="w-3.5 h-3.5" /> API Connected
                   </div>
                 </div>
                 
                 <div className="p-6 md:p-8 space-y-8 max-w-3xl">
                    <div>
                      <label className="block text-sm font-bold text-text mb-2">OpenAI API Key</label>
                      <div className="flex gap-3">
                        <input type="password" defaultValue="sk-proj-....................." className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-mono tracking-widest text-gray-500" />
                        <button className="px-6 py-3 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-primary rounded-xl font-bold text-sm transition-colors shadow-sm">Verify</button>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-2">Required for IQ Test analysis and customized diet/exercise plan generation.</p>
                    </div>
                    
                    <hr className="border-gray-100" />
                    
                    <div>
                       <h4 className="text-sm font-bold text-text mb-4 uppercase tracking-wider">AI Feature Toggles</h4>
                       <div className="space-y-4">
                         <label className="flex items-center justify-between p-5 border border-gray-200 rounded-2xl cursor-pointer hover:border-primary/40 hover:bg-blue-50/30 transition-all shadow-sm group">
                           <div>
                              <p className="font-bold text-text text-base">Automated IQ Analysis</p>
                              <p className="text-sm text-gray-500 font-medium mt-1">Use AI to generate textual recommendations from IQ test matrix scores.</p>
                           </div>
                           <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                              <input type="checkbox" defaultChecked name="toggle" id="toggle1" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" style={{ right: 0, borderColor: '#2563EB' }}/>
                              <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-primary cursor-pointer"></label>
                           </div>
                         </label>

                         <label className="flex items-center justify-between p-5 border border-gray-200 rounded-2xl cursor-pointer hover:border-primary/40 hover:bg-blue-50/30 transition-all shadow-sm group">
                           <div>
                              <p className="font-bold text-text text-base">Dietary AI Suggestions</p>
                              <p className="text-sm text-gray-500 font-medium mt-1">Suggest weekly meals matching medical flags in preliminary assessments.</p>
                           </div>
                           <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                              <input type="checkbox" defaultChecked name="toggle" id="toggle2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" style={{ right: 0, borderColor: '#2563EB' }}/>
                              <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-primary cursor-pointer"></label>
                           </div>
                         </label>
                       </div>
                    </div>
                 </div>
               </div>
            )}

            {/* Placeholder for other tabs */}
            {!['General', 'AI Configuration'].includes(activeTab) && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-gray-400 p-8 text-center animate-in fade-in">
                <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                  {tabs.find(t => t.id === activeTab)?.icon && (() => {
                    const Icon = tabs.find(t => t.id === activeTab).icon;
                    return <Icon className="w-10 h-10 text-gray-300" />;
                  })()}
                </div>
                <h3 className="text-2xl font-admin-heading font-black text-gray-800 mb-2">{activeTab}</h3>
                <p className="text-gray-500 font-medium max-w-sm">This configuration panel is currently under development. Settings will be available in the next release.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default AdminSettings;
