import { User, Bell, Shield, LogOut, Globe, ChevronRight } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-extrabold text-primary mb-2">Account Settings</h2>
        <p className="text-muted font-medium">Manage your profile, preferences, and subscription.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Sidebar Nav */}
        <div className="space-y-2">
          {[
            { id: 'profile', icon: User, label: 'Profile Settings', active: true },
            { id: 'notifications', icon: Bell, label: 'Notifications', active: false },
            { id: 'privacy', icon: Shield, label: 'Privacy & Security', active: false },
            { id: 'language', icon: Globe, label: 'Language', active: false },
          ].map(tab => (
            <button key={tab.id} className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-sm transition-all ${tab.active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-muted border border-gray-100 hover:border-gray-300 hover:text-text'}`}>
              <div className="flex items-center gap-3">
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </div>
              {!tab.active && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}

          <button className="w-full flex items-center gap-3 p-4 rounded-xl font-bold text-sm text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors mt-8">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section: Profile */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-heading font-bold text-text mb-6 pb-4 border-b border-gray-100">Profile Settings</h3>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-bold">
                P
              </div>
              <div>
                <button className="px-4 py-2 bg-gray-100 text-text font-bold text-sm rounded-lg hover:bg-gray-200 transition-colors mb-2">
                  Change Photo
                </button>
                <p className="text-xs text-muted">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text block">Full Name</label>
                <input type="text" defaultValue="Parent Name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text block">Email Address</label>
                <input type="email" defaultValue="parent@example.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all">
                Save Changes
              </button>
            </div>
          </div>

          {/* Section: Subscription */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
             <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
               <div>
                 <div className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-950 text-xs font-black rounded-md uppercase tracking-widest mb-3">
                   Pro Plan
                 </div>
                 <h3 className="text-2xl font-heading font-black mb-1">Wings Premium</h3>
                 <p className="text-gray-400 font-medium text-sm">Next billing date: 24th June, 2026</p>
               </div>
               <button className="w-full md:w-auto px-6 py-3 bg-white text-gray-900 font-black rounded-xl hover:bg-gray-100 transition-colors">
                 Manage Billing
               </button>
             </div>
          </div>

          {/* Section: Language */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-heading font-bold text-text mb-4">Regional Settings</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4">
               <label className="flex-1 border-2 border-primary bg-primary/5 rounded-xl p-4 flex items-center gap-3 cursor-pointer text-primary font-bold">
                 <input type="radio" name="lang" className="w-4 h-4 text-primary focus:ring-primary" defaultChecked />
                 English (US)
               </label>
               <label className="flex-1 border-2 border-gray-100 bg-white rounded-xl p-4 flex items-center gap-3 cursor-pointer text-text font-bold hover:border-gray-200 transition-colors">
                 <input type="radio" name="lang" className="w-4 h-4 text-primary focus:ring-primary" />
                 Malayalam (മലയാളം)
               </label>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Settings;
