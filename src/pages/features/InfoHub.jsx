import { useState } from 'react';
import { Search, Info, Shield, HeartHandshake, BriefcaseMedical, ExternalLink, GraduationCap, Building2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Resources' },
  { id: 'grants', label: 'State Grants' },
  { id: 'card', label: 'UD ID Card' },
  { id: 'insurance', label: 'Niramaya Insurance' },
  { id: 'pension', label: 'Disability Pension' },
];

const HUB_ITEMS = [
  { id: 1, title: 'Apply for UD ID Card', cat: 'card', icon: Shield, desc: 'The Unique Disability ID allows availing multiple government benefits without carrying multiple documents.', linkText: 'Application Portal' },
  { id: 2, title: 'Niramaya Health Insurance', cat: 'insurance', icon: BriefcaseMedical, desc: 'Scheme for affordable Health Insurance to persons with Autism, Cerebral Palsy, Mental Retardation and Multiple Disabilities.', linkText: 'Scheme Details' },
  { id: 3, title: 'Disability Pension Scheme (Kerala)', cat: 'pension', icon: Building2, desc: 'Monthly financial assistance provided by the State Government for individuals with severe disabilities.', linkText: 'Download Form' },
  { id: 4, title: 'Special Needs Scholarship', cat: 'grants', icon: GraduationCap, desc: 'Educational grant for children attending special schools or inclusive education programs.', linkText: 'Eligibility Criteria' },
];

const InfoHub = () => {
  const [activeCat, setActiveCat] = useState('all');

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      
      {/* Search & Header */}
      <div className="bg-primary rounded-[2.5rem] p-8 sm:p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Info className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl font-heading font-black mb-4">Information Hub</h2>
          <p className="text-primary-100 font-medium mb-8">Access comprehensive guides on state grants, legal rights, insurance, and medical certificates.</p>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search for 'Niramaya' or 'Pension'..." 
              className="w-full pl-14 pr-6 py-4 bg-white text-text border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-secondary/30 outline-none transition-all shadow-xl text-lg font-medium"
            />
          </div>
        </div>
      </div>

      {/* PARIVAAR Highlight */}
      <div className="bg-gradient-to-r from-secondary/10 to-accent/10 border-2 border-secondary/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
          <HeartHandshake className="w-8 h-8 text-secondary" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-secondary text-white text-xs font-bold rounded-md uppercase tracking-wider mb-2">
            NCPO Support
          </div>
          <h3 className="text-xl font-bold text-text mb-2">Did you know about PARIVAAR?</h3>
          <p className="text-muted font-medium text-sm max-w-2xl">
            PARIVAAR is the National Confederation of Parents Organizations. They provide unparalleled community support and legislative advocacy for families with intellectually disabled children in India.
          </p>
        </div>
        <button className="px-6 py-3 bg-white text-secondary font-bold rounded-xl border border-secondary/20 hover:bg-secondary hover:text-white transition-all whitespace-nowrap">
          Visit PARIVAAR
        </button>
      </div>

      {/* Categories Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-4">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
              activeCat === cat.id 
                ? 'bg-text text-white border-text shadow-md' 
                : 'bg-white text-muted border-gray-200 hover:border-gray-300 hover:text-text'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Info Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {HUB_ITEMS.filter(item => activeCat === 'all' || item.cat === activeCat).map(item => (
          <div key={item.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-text leading-tight pt-1">{item.title}</h3>
            </div>
            <p className="text-muted text-sm leading-relaxed mb-6 flex-1">
              {item.desc}
            </p>
            <button className="mt-auto w-full py-3.5 bg-gray-50 text-primary font-bold rounded-xl border border-gray-100 hover:border-primary/30 flex justify-center items-center gap-2 group-hover:bg-primary/5 transition-colors text-sm">
              {item.linkText} <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default InfoHub;
