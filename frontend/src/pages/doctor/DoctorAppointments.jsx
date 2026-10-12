import { useState } from 'react';
import { CalendarDays, Clock, Video, FileText, ChevronLeft, ChevronRight, User, MoreVertical, CheckCircle2 } from 'lucide-react';

const APPOINTMENTS = [
  { id: 1, patient: 'Aarav Patel', type: 'Speech Therapy', time: '10:00 AM - 10:45 AM', format: 'In-Clinic', status: 'Confirmed', color: 'border-primary' },
  { id: 2, patient: 'Rahul Sharma', type: 'Assessment Review', time: '11:00 AM - 11:30 AM', format: 'Video Consult', status: 'Confirmed', color: 'border-emerald-500' },
  { id: 3, patient: 'Ananya Gupta', type: 'Parent Consultation', time: '02:00 PM - 02:30 PM', format: 'Video Consult', status: 'Pending', color: 'border-purple-500' },
  { id: 4, patient: 'Kabir Singh', type: 'Behavioral Therapy', time: '03:15 PM - 04:00 PM', format: 'In-Clinic', status: 'Rescheduled', color: 'border-amber-500' },
];

const DoctorAppointments = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h2 className="text-2xl font-admin-heading font-black text-gray-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
               <CalendarDays className="w-6 h-6" />
             </div>
             Appointments
           </h2>
           <p className="text-gray-500 font-medium text-sm mt-1 ml-11">Manage your clinical schedule and video consultations.</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
           <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
           <span className="text-sm font-black text-gray-800 min-w-[120px] text-center">Oct 26, 2024</span>
           <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:shadow-sm"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Column: Schedule List */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
               
               <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                 <h3 className="text-lg font-black text-gray-800">Today's Schedule</h3>
                 <div className="flex gap-2">
                   <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">4 Total</span>
                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">2 Video</span>
                 </div>
               </div>

               <div className="space-y-4">
                  {APPOINTMENTS.map((apt) => (
                    <div key={apt.id} className={`p-5 rounded-xl border-l-4 ${apt.color} border-y border-r border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 group relative overflow-hidden`}>
                       
                       <div className="flex items-center gap-4 relative z-10">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 flex flex-col items-center justify-center shrink-0 border border-gray-200">
                            <span className="text-xs font-black text-gray-800">{apt.time.split(' ')[0]}</span>
                            <span className="text-[9px] font-bold text-gray-500 uppercase">{apt.time.split(' ')[1]}</span>
                          </div>
                          <div>
                            <h4 className="text-base font-black text-gray-800 group-hover:text-primary transition-colors">{apt.patient}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {apt.type}</span>
                              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                {apt.format === 'Video Consult' ? <Video className="w-3.5 h-3.5 text-blue-500" /> : <User className="w-3.5 h-3.5 text-emerald-500" />} 
                                {apt.format}
                              </span>
                            </div>
                          </div>
                       </div>

                       <div className="flex items-center gap-4 relative z-10 sm:justify-end pl-16 sm:pl-0">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                            apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' :
                            apt.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {apt.status}
                          </span>
                          
                          {apt.format === 'Video Consult' && apt.status === 'Confirmed' ? (
                            <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                              <Video className="w-3.5 h-3.5" /> Join Call
                            </button>
                          ) : (
                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          )}
                       </div>

                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Column: Mini Calendar & Actions */}
         <div className="space-y-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
               <h3 className="text-base font-black text-gray-800 mb-4">Quick Actions</h3>
               <div className="space-y-3">
                 <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-left px-4 flex items-center justify-between group">
                   Block Time Off
                   <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                 </button>
                 <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-left px-4 flex items-center justify-between group">
                   Reschedule Requests
                   <span className="w-5 h-5 rounded bg-red-100 text-red-600 flex items-center justify-center text-xs">1</span>
                 </button>
                 <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-left px-4 flex items-center justify-between group">
                   Sync External Calendar
                   <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                 </button>
               </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-sm border border-indigo-100 p-6">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/30">
                   <Video className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="text-base font-black text-gray-800">Telehealth Ready</h3>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">System Check Passed</p>
                 </div>
               </div>
               <div className="space-y-2 mb-6">
                 <div className="flex items-center justify-between text-sm font-bold text-gray-600">
                   <span>Camera</span>
                   <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> OK</span>
                 </div>
                 <div className="flex items-center justify-between text-sm font-bold text-gray-600">
                   <span>Microphone</span>
                   <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> OK</span>
                 </div>
                 <div className="flex items-center justify-between text-sm font-bold text-gray-600">
                   <span>Connection</span>
                   <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 120 Mbps</span>
                 </div>
               </div>
               <button className="w-full py-2.5 bg-white border border-indigo-200 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-50 transition-colors shadow-sm">
                 Test Equipment
               </button>
            </div>

         </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
