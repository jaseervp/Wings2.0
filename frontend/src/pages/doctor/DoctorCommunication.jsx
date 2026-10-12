import { useState } from 'react';
import { MessageSquare, Search, Phone, Video, MoreVertical, Paperclip, Send, Image as ImageIcon, Smile, FileText } from 'lucide-react';

const CONVERSATIONS = [
  { id: 1, name: 'Neha Patel', relation: 'Aarav\'s Mother', message: 'Thank you doctor, we will practice those sounds tonight.', time: '10:42 AM', unread: 0, active: true },
  { id: 2, name: 'Raj Sharma', relation: 'Riya\'s Father', message: 'Could you please resend the diet plan?', time: 'Yesterday', unread: 2, active: false },
  { id: 3, name: 'Priya Singh', relation: 'Kabir\'s Mother', message: 'The new exercises are working really well!', time: 'Yesterday', unread: 0, active: false },
  { id: 4, name: 'Amit Gupta', relation: 'Ananya\'s Father', message: 'She is having trouble with the pegboard.', time: 'Oct 24', unread: 0, active: false },
];

const DoctorCommunication = () => {
  return (
    <div className="h-[calc(100vh-160px)] animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
      
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-t-2xl shadow-sm border border-gray-200 shrink-0">
         <h2 className="text-2xl font-admin-heading font-black text-gray-800 tracking-tight flex items-center gap-3">
           <div className="p-2 bg-blue-50 text-primary rounded-lg">
             <MessageSquare className="w-6 h-6" />
           </div>
           Parent Communication
         </h2>
         <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors">
            New Message
         </button>
      </div>

      <div className="flex-1 flex overflow-hidden border-x border-b border-gray-200 rounded-b-2xl shadow-sm bg-white">
         
         {/* Left Sidebar: Conversations List */}
         <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30 shrink-0">
            <div className="p-4 border-b border-gray-100">
               <div className="relative group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                 <input type="text" placeholder="Search messages..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-gray-800" />
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
               {CONVERSATIONS.map((chat) => (
                 <div key={chat.id} className={`p-4 border-b border-gray-100 cursor-pointer transition-colors flex gap-3 ${chat.active ? 'bg-blue-50/50 border-l-4 border-l-primary' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {chat.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start mb-0.5">
                         <h4 className={`text-sm truncate ${chat.unread > 0 ? 'font-black text-gray-900' : 'font-bold text-gray-800'}`}>{chat.name}</h4>
                         <span className={`text-[10px] whitespace-nowrap ${chat.unread > 0 ? 'font-bold text-primary' : 'font-medium text-gray-400'}`}>{chat.time}</span>
                       </div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{chat.relation}</p>
                       <p className={`text-xs truncate ${chat.unread > 0 ? 'font-bold text-gray-800' : 'font-medium text-gray-500'}`}>{chat.message}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-3">
                        {chat.unread}
                      </div>
                    )}
                 </div>
               ))}
            </div>
         </div>

         {/* Right Area: Active Chat */}
         <div className="flex-1 flex flex-col bg-white min-w-0">
            
            {/* Chat Header */}
            <div className="h-[72px] border-b border-gray-100 flex items-center justify-between px-6 shrink-0 bg-white">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-primary font-bold text-sm">
                    N
                 </div>
                 <div>
                   <h3 className="text-base font-black text-gray-800">Neha Patel</h3>
                   <p className="text-xs font-bold text-gray-500">Aarav's Mother • Speech Therapy</p>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"><Phone className="w-5 h-5" /></button>
                 <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"><Video className="w-5 h-5" /></button>
                 <div className="w-px h-6 bg-gray-200 mx-1"></div>
                 <button className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"><MoreVertical className="w-5 h-5" /></button>
               </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
               
               <div className="flex justify-center">
                 <span className="px-3 py-1 bg-gray-200/50 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider">Today</span>
               </div>

               <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-primary font-bold text-xs shrink-0 mb-1">N</div>
                  <div className="bg-white border border-gray-200 p-3.5 rounded-2xl rounded-bl-sm shadow-sm max-w-[70%]">
                    <p className="text-sm font-medium text-gray-700">Good morning Dr. Sarah. We tried the new flashcards for bilabial sounds yesterday.</p>
                    <span className="text-[10px] font-bold text-gray-400 block mt-1">10:30 AM</span>
                  </div>
               </div>

               <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-primary font-bold text-xs shrink-0 mb-1">N</div>
                  <div className="bg-white border border-gray-200 p-3.5 rounded-2xl rounded-bl-sm shadow-sm max-w-[70%]">
                    <p className="text-sm font-medium text-gray-700">He seems to struggle a bit with the 'M' sound. Is there a specific technique we should use?</p>
                    <span className="text-[10px] font-bold text-gray-400 block mt-1">10:31 AM</span>
                  </div>
               </div>

               <div className="flex items-end gap-2 justify-end">
                  <div className="bg-primary text-white p-3.5 rounded-2xl rounded-br-sm shadow-sm max-w-[70%]">
                    <p className="text-sm font-medium">Hello Neha! That's completely normal at this stage. Try placing his hand lightly on your throat so he can feel the vibration when you make the 'M' sound, then have him try it on himself.</p>
                    <span className="text-[10px] font-bold text-blue-100 block mt-1 text-right">10:38 AM</span>
                  </div>
               </div>

               <div className="flex items-end gap-2 justify-end">
                  <div className="bg-primary text-white p-3.5 rounded-2xl rounded-br-sm shadow-sm max-w-[70%]">
                    <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-xl mb-2 border border-white/20">
                       <FileText className="w-6 h-6 text-blue-100" />
                       <div>
                         <p className="text-sm font-bold text-white">M_Sound_Guide.pdf</p>
                         <p className="text-[10px] text-blue-100">1.2 MB</p>
                       </div>
                    </div>
                    <p className="text-sm font-medium">I've also attached a quick visual guide you can use.</p>
                    <span className="text-[10px] font-bold text-blue-100 block mt-1 text-right">10:39 AM</span>
                  </div>
               </div>

               <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-primary font-bold text-xs shrink-0 mb-1">N</div>
                  <div className="bg-white border border-gray-200 p-3.5 rounded-2xl rounded-bl-sm shadow-sm max-w-[70%]">
                    <p className="text-sm font-medium text-gray-700">Thank you doctor, we will practice those sounds tonight.</p>
                    <span className="text-[10px] font-bold text-gray-400 block mt-1">10:42 AM</span>
                  </div>
               </div>

            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
               <div className="flex items-end gap-2">
                 <div className="flex gap-1 mb-1">
                   <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"><Paperclip className="w-5 h-5" /></button>
                   <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"><ImageIcon className="w-5 h-5" /></button>
                   <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"><Smile className="w-5 h-5" /></button>
                 </div>
                 <div className="flex-1 relative">
                   <textarea 
                     className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none font-medium text-gray-800 placeholder:text-gray-400"
                     placeholder="Type your message..."
                     rows="1"
                   ></textarea>
                   <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
                     <Send className="w-4 h-4" />
                   </button>
                 </div>
               </div>
            </div>

         </div>

      </div>
    </div>
  );
};

export default DoctorCommunication;
