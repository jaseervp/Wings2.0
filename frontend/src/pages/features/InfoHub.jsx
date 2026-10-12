import { useState } from 'react';
import { 
  Search, Info, Shield, HeartHandshake, BriefcaseMedical, ExternalLink, 
  GraduationCap, Building2, Bot, Bell, FileText, CheckCircle2, 
  Clock, ChevronRight, HelpCircle, Users, ArrowRight, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'all', label: 'All Resources' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'financial', label: 'Financial Aid' },
  { id: 'education', label: 'Education' },
  { id: 'legal', label: 'Legal Rights' },
];

const HUB_ITEMS = [
  { id: 1, title: 'Niramaya Health Insurance', cat: 'healthcare', icon: BriefcaseMedical, desc: 'Scheme for affordable Health Insurance to persons with Autism, Cerebral Palsy, Mental Retardation and Multiple Disabilities.', linkText: 'Check Eligibility' },
  { id: 2, title: 'Disability Pension Scheme', cat: 'financial', icon: Building2, desc: 'Monthly financial assistance provided by the State Government for individuals with severe disabilities.', linkText: 'Download Form' },
  { id: 3, title: 'Special Needs Scholarship', cat: 'education', icon: GraduationCap, desc: 'Educational grant for children attending special schools or inclusive education programs.', linkText: 'View Details' },
  { id: 4, title: 'Legal Guardianship', cat: 'legal', icon: Shield, desc: 'Guide to applying for legal guardianship under the National Trust Act.', linkText: 'Read Guide' },
];

const FAQS = [
  { q: "How do I apply for a UDID card?", a: "You can apply online at the swavlambancard.gov.in portal. You'll need Aarav's recent photo, address proof, and disability certificate." },
  { q: "Is the Niramaya scheme applicable in all states?", a: "Yes, Niramaya is a national scheme provided by the National Trust, though local implementation may vary slightly." },
  { q: "What is the disability criteria for the state pension?", a: "Typically, a disability percentage of 40% or above certified by a medical board is required to be eligible for the monthly pension." }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const InfoHub = () => {
  const [activeCat, setActiveCat] = useState('all');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-heading font-extrabold text-primary mb-1">Support Center</h2>
          <p className="text-muted font-medium text-sm">Government benefits, rights, and community support</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search 'Niramaya' or 'Pension'..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm shadow-sm font-medium"
          />
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* 1. Hero Section */}
        <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 sm:p-10 border border-white bg-gradient-to-br from-primary to-blue-800 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -ml-20 -mb-20" />
          
          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-xs font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-300" /> 3 Eligible Programs Found
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold leading-tight">
              Benefits Available<br/>for Aarav
            </h2>
            <p className="text-blue-100 font-medium max-w-md">
              Based on Aarav's profile, we have identified several state and national programs you can apply for today.
            </p>
          </div>
          
          <div className="relative z-10 flex gap-4 w-full md:w-auto">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[150px]">
              <span className="text-4xl font-heading font-black leading-tight drop-shadow-md text-yellow-300">₹8k</span>
              <span className="text-sm font-bold opacity-90 tracking-wide mt-1 text-center">Potential Monthly<br/>Assistance</span>
            </div>
          </div>
        </motion.div>

        {/* 3. Quick Access Services */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: "UDID Card", icon: Shield, color: "text-blue-600", bg: "bg-blue-100" },
            { title: "Niramaya", icon: BriefcaseMedical, color: "text-secondary", bg: "bg-secondary/20" },
            { title: "Pension", icon: Building2, color: "text-purple-600", bg: "bg-purple-100" },
            { title: "Education", icon: GraduationCap, color: "text-accent", bg: "bg-accent/20" },
            { title: "Legal Rights", icon: FileText, color: "text-red-500", bg: "bg-red-100" },
            { title: "Communities", icon: Users, color: "text-green-600", bg: "bg-green-100" },
          ].map((service, i) => (
            <div key={i} className="glass bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 border border-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${service.bg} ${service.color}`}>
                <service.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-text">{service.title}</span>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 5. Resource Categories */}
            <motion.div variants={itemVariants}>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                      activeCat === cat.id 
                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                        : 'bg-white text-muted border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 6. Featured Resources */}
            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-6">
              {HUB_ITEMS.filter(item => activeCat === 'all' || item.cat === activeCat).map(item => (
                <div key={item.id} className="glass bg-white rounded-[2rem] p-6 sm:p-8 border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 text-primary flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-text leading-tight pt-1">{item.title}</h3>
                  </div>
                  <p className="text-muted text-sm font-medium leading-relaxed mb-6 flex-1">
                    {item.desc}
                  </p>
                  <button className="mt-auto w-full py-3 bg-gray-50 text-primary font-bold rounded-xl border border-gray-100 hover:border-primary/30 flex justify-center items-center gap-2 group-hover:bg-primary/5 transition-colors text-sm">
                    {item.linkText} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </motion.div>

            {/* 8. Parent Community Network */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-8 relative overflow-hidden bg-gradient-to-br from-secondary/10 to-emerald-50">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shrink-0 shadow-md border-4 border-white/50">
                  <HeartHandshake className="w-10 h-10 text-secondary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-3 py-1 bg-secondary text-white text-xs font-bold rounded-lg uppercase tracking-wider mb-3 shadow-sm">
                    Advocacy Network
                  </div>
                  <h3 className="text-2xl font-heading font-extrabold text-text mb-2">Connect with PARIVAAR</h3>
                  <p className="text-muted font-medium text-sm max-w-xl">
                    The National Confederation of Parents Organizations provides unparalleled community support, legislative advocacy, and guidance for families with intellectually disabled children.
                  </p>
                </div>
                <button className="px-8 py-3.5 bg-white text-secondary font-bold rounded-xl border border-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all whitespace-nowrap">
                  Join Community
                </button>
              </div>
            </motion.div>

            {/* 9. FAQ Section */}
            <motion.div variants={itemVariants} className="glass bg-white rounded-[2.5rem] p-8 border border-white shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gray-100 rounded-xl text-gray-600 border border-gray-200">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-text">Frequently Asked Questions</h3>
              </div>
              <div className="space-y-4">
                {FAQS.map((faq, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <h4 className="font-bold text-text text-sm mb-2 group-hover:text-primary transition-colors flex justify-between items-center">
                      {faq.q}
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                    </h4>
                    <p className="text-sm text-muted font-medium">{faq.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-8">
            
            {/* 2. AI Eligibility Assistant */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="absolute -right-6 -bottom-6 opacity-5">
                <Bot className="w-48 h-48 text-indigo-600" />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm border border-indigo-200">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-indigo-900">Eligibility Check</h3>
              </div>
              <p className="text-sm text-indigo-900/80 font-medium leading-relaxed relative z-10 mb-6">
                Based on Aarav's updated diagnosis, he is now eligible for the <strong>Niramaya Health Insurance</strong> scheme. Would you like me to guide you through the application?
              </p>
              <button className="w-full py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors relative z-10 shadow-md shadow-indigo-200">
                Start Application Process
              </button>
            </motion.div>

            {/* 4. Application Tracker */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm border border-primary/20">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-text">Application Status</h3>
              </div>
              
              <div className="relative space-y-6">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
                
                <div className="relative flex items-start gap-4 z-10">
                  <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center shrink-0 border-[3px] border-white shadow-sm mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text">UDID Card</h4>
                    <p className="text-xs font-bold text-success mt-0.5">Approved & Dispatched</p>
                    <p className="text-xs text-muted font-medium mt-1">Expected delivery by May 20.</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4 z-10">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0 border-[3px] border-white shadow-sm mt-0.5 animate-pulse">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text">Disability Pension</h4>
                    <p className="text-xs font-bold text-accent mt-0.5">Under Review</p>
                    <p className="text-xs text-muted font-medium mt-1">Submitted on April 15. Pending medical board approval.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 7. Government Updates */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-100 rounded-xl text-gray-600 shadow-sm border border-gray-200">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-text">Latest Updates</h3>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:border-primary/30 transition-colors group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Policy Change</span>
                  </div>
                  <h4 className="text-sm font-bold text-text leading-tight group-hover:text-primary transition-colors">Revision of Niramaya Insurance premium rates for 2026.</h4>
                </div>
                
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:border-primary/30 transition-colors group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">New Program</span>
                  </div>
                  <h4 className="text-sm font-bold text-text leading-tight group-hover:text-primary transition-colors">State launches specialized transport subsidy scheme.</h4>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InfoHub;
