import { useState } from 'react';
import { Settings, User, Bell, Shield, Wallet, BookOpen, Clock, Camera, Save } from 'lucide-react';

const DoctorSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-gray-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
               <Settings className="w-6 h-6" />
             </div>
             Provider Settings
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Manage your clinical profile, preferences, and security.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         
         {/* Settings Navigation */}
         <div className="lg:w-64 shrink-0 space-y-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'profile' ? 'bg-white shadow-sm border border-gray-200 text-primary' : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-800'}`}
            >
              <User className="w-4 h-4" /> Professional Profile
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'schedule' ? 'bg-white shadow-sm border border-gray-200 text-primary' : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-800'}`}
            >
              <Clock className="w-4 h-4" /> Availability & Hours
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'notifications' ? 'bg-white shadow-sm border border-gray-200 text-primary' : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-800'}`}
            >
              <Bell className="w-4 h-4" /> Notifications
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'security' ? 'bg-white shadow-sm border border-gray-200 text-primary' : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-800'}`}
            >
              <Shield className="w-4 h-4" /> Security & Privacy
            </button>
            <button 
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'billing' ? 'bg-white shadow-sm border border-gray-200 text-primary' : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-800'}`}
            >
              <Wallet className="w-4 h-4" /> Billing & Payouts
            </button>
         </div>

         {/* Settings Content Area */}
         <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
               
               {activeTab === 'profile' && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <h3 className="text-lg font-black text-gray-800 mb-1">Professional Profile</h3>
                      <p className="text-sm font-bold text-gray-500 mb-6">Update your clinical details and public profile.</p>
                      
                      <div className="flex items-center gap-6 mb-8">
                         <div className="w-24 h-24 rounded-2xl bg-indigo-50 border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center text-indigo-500 hover:bg-indigo-100 hover:border-indigo-300 transition-colors cursor-pointer group relative overflow-hidden">
                           <Camera className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                           <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                         </div>
                         <div>
                           <h4 className="text-sm font-black text-gray-800">Profile Photo</h4>
                           <p className="text-xs font-medium text-gray-500 mt-1 max-w-sm">Upload a professional headshot. Recommended size is 400x400px.</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Full Name</label>
                           <input type="text" defaultValue="Dr. Sarah Jenkins" className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 outline-none font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm" />
                         </div>
                         <div>
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Clinical Title</label>
                           <input type="text" defaultValue="Senior Speech-Language Pathologist" className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 outline-none font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm" />
                         </div>
                         <div>
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Email Address</label>
                           <input type="email" defaultValue="dr.jenkins@wingsapp.com" className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 outline-none font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm" />
                         </div>
                         <div>
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                           <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 outline-none font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm" />
                         </div>
                         <div className="md:col-span-2">
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Professional Bio</label>
                           <textarea rows="4" className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 outline-none font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm resize-none" defaultValue="Specializing in early childhood speech development and articulation disorders with over 10 years of clinical experience."></textarea>
                         </div>
                      </div>
                    </div>
                    
                    <hr className="border-gray-100" />

                    <div>
                      <h3 className="text-base font-black text-gray-800 mb-4">Qualifications & Credentials</h3>
                      <div className="space-y-4">
                         <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><BookOpen className="w-4 h-4" /></div>
                               <div>
                                 <h4 className="text-sm font-bold text-gray-800">ASHA Certification (CCC-SLP)</h4>
                                 <p className="text-xs font-medium text-gray-500 mt-0.5">Verified • Expires Dec 2025</p>
                               </div>
                            </div>
                            <button className="text-xs font-bold text-primary hover:underline">Update</button>
                         </div>
                      </div>
                    </div>
                 </div>
               )}

               {activeTab !== 'profile' && (
                 <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6 border border-gray-100">
                      <Settings className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-black text-gray-800 mb-2">Section Under Construction</h3>
                    <p className="text-sm font-medium text-gray-500 max-w-sm">The settings for {activeTab} will be available in the next platform update.</p>
                 </div>
               )}

            </div>
         </div>

      </div>
    </div>
  );
};

export default DoctorSettings;
