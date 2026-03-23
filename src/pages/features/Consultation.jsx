import { useState } from 'react';
import { Calendar, Clock, Video, Star, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';

const DOCTORS = [
  { id: 1, name: 'Dr. Sarah Philip', spec: 'Child Psychologist', rating: 4.9, reviews: 124, type: 'Video & In-Person', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200' },
  { id: 2, name: 'Dr. Rajiv Menon', spec: 'Speech Therapist', rating: 4.8, reviews: 89, type: 'Video', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200' },
  { id: 3, name: 'Dr. Anita Desai', spec: 'Occupational Therapist', rating: 4.9, reviews: 210, type: 'In-Person', img: 'https://images.unsplash.com/photo-1594824436998-d8abc63b8655?auto=format&fit=crop&q=80&w=200' },
];

const Consultation = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Upcoming Appointments */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-xl font-heading font-extrabold text-primary mb-6">Upcoming Appointments</h2>
        <div className="flex flex-col md:flex-row gap-6 bg-secondary/5 rounded-2xl p-6 border border-secondary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Video className="h-32 w-32 text-secondary" />
          </div>
          <div className="flex-shrink-0 relative z-10 w-20 h-20 rounded-full bg-secondary/20 flex flex-col items-center justify-center text-secondary border-2 border-white shadow-md">
            <span className="text-sm font-bold leading-none">MAY</span>
            <span className="text-2xl font-black leading-none">16</span>
          </div>
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-3 space-x-2 text-sm text-secondary font-bold bg-secondary/10 inline-flex px-3 py-1 rounded-full mb-3">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> 10:00 AM</span>
              <span className="w-1 h-1 rounded-full bg-secondary"></span>
              <span className="flex items-center gap-1.5"><Video className="w-4 h-4"/> Video Call</span>
            </div>
            <h3 className="text-2xl font-heading font-black text-text">Speech Therapy Review</h3>
            <p className="text-muted mt-1 font-medium">with Dr. Rajiv Menon</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 relative z-10">
            <button className="px-6 py-3 bg-secondary text-white rounded-full font-bold shadow-lg shadow-secondary/30 hover:shadow-secondary/40 hover:-translate-y-0.5 transition-all w-full sm:w-auto">
              Join Call
            </button>
            <button className="px-6 py-3 bg-white text-muted border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all w-full sm:w-auto">
              Reschedule
            </button>
          </div>
        </div>
      </div>

      {/* Specialist Listing */}
      <h2 className="text-xl font-heading font-extrabold text-primary pt-4">Book a Specialist</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DOCTORS.map(doc => (
          <div key={doc.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all group flex flex-col">
            <div className="flex items-start gap-4 mb-6">
              <img src={doc.img} alt={doc.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm border-2 border-white" />
              <div>
                <h4 className="font-bold text-lg text-text group-hover:text-primary transition-colors">{doc.name}</h4>
                <p className="text-xs text-primary font-bold bg-primary/10 inline-block px-2 py-1 rounded-md mb-2">{doc.spec}</p>
                <div className="flex items-center gap-1 text-sm text-muted font-medium">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-text font-bold">{doc.rating}</span>
                  <span>({doc.reviews})</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted font-medium bg-gray-50 p-3 rounded-xl mb-6">
              <div className="flex items-center gap-1.5"><Video className="w-4 h-4 text-secondary"/> Video</div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary"/> Clinic</div>
            </div>
            
            <button 
              onClick={() => setSelectedDoc(doc)}
              className="mt-auto w-full py-3.5 bg-gray-50 text-text font-bold rounded-xl border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all flex justify-center items-center gap-2"
            >
              Book Consultation <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal Overlay */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-text/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setSelectedDoc(null) }}>
          <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-heading font-black text-primary">Book Appointment</h3>
                <p className="text-muted font-medium">{selectedDoc.name} - {selectedDoc.spec}</p>
              </div>
              <img src={selectedDoc.img} alt="" className="w-14 h-14 rounded-full object-cover" />
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-text mb-2 block">Select Date</label>
                <input type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>

              <div>
                <label className="text-sm font-bold text-text mb-2 block">Select Time Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="border-2 border-primary bg-primary/5 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer text-primary font-bold">
                    <input type="radio" name="format" className="hidden" defaultChecked />
                    <Video className="w-5 h-5" /> Video Call
                  </label>
                  <label className="border-2 border-gray-100 bg-white rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer text-muted font-bold hover:border-primary">
                    <input type="radio" name="format" className="hidden" />
                    <MapPin className="w-5 h-5" /> In-person
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-text mb-2 block">Notes to Specialist</label>
                <textarea rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Briefly describe what you'd like to discuss..."></textarea>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button onClick={() => setSelectedDoc(null)} className="flex-1 py-4 text-text font-bold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={() => setSelectedDoc(null)} className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 flex justify-center items-center gap-2 shadow-lg shadow-primary/30 transition-all">
                  <CheckCircle2 className="w-5 h-5" /> Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultation;
