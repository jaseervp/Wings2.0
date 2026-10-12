import { Link } from 'react-router-dom';
import { Brain, Heart, Activity, ArrowRight, ShieldCheck, CheckCircle2, Play, Users, Sparkles, Star } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col w-full bg-[#f8fafc] overflow-hidden">
      
      {/* ========================================= */}
      {/* HERO SECTION                              */}
      {/* ========================================= */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        
        {/* Soft Background Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/80 via-teal-50/40 to-transparent pointer-events-none -z-10"></div>
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute top-40 left-[-10%] w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copy & CTAs */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-8 border border-indigo-200/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
              </span>
              Early Detection Saves Futures
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Give Your Child the <br className="hidden sm:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">Wings to Fly</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              A professional, parent-centered platform for early detection, tracking, and support for children with intellectual disabilities. Assured guidance, every step of the way.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link to="/register" className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-[0_8px_25px_-8px_rgba(79,70,229,0.6)] hover:shadow-[0_12px_30px_-8px_rgba(79,70,229,0.8)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <button className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-800 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm w-full sm:w-auto">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <Play className="h-3 w-3 text-indigo-600 ml-0.5" />
                </div>
                Watch Demo
              </button>
            </div>
            
            <div className="mt-10 flex items-center gap-4 animate-in fade-in duration-700 delay-500">
              <div className="flex -space-x-3">
                 {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center shadow-sm">
                     <Users className="w-4 h-4 text-indigo-400" />
                   </div>
                 ))}
              </div>
              <div className="text-sm font-semibold text-gray-600">
                Trusted by <span className="text-indigo-600 font-bold">10,000+</span> Parents
              </div>
            </div>
          </div>
          
          {/* Right: Premium Imagery */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
             {/* Decorative Background for Image */}
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-teal-400/10 rounded-[3rem] blur-2xl transform rotate-3"></div>
             
             <div className="relative z-10 rounded-[2.5rem] bg-white p-2 sm:p-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-white/60">
               <div className="relative overflow-hidden rounded-[2rem]">
                 <img 
                   src="https://images.unsplash.com/photo-1544640808-32caaefce5ed?auto=format&fit=crop&q=80&w=800" 
                   alt="Parent and child" 
                   className="object-cover h-[450px] sm:h-[550px] w-full transform hover:scale-105 transition-transform duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
               </div>
               
               {/* Floating Glassmorphism Badge */}
               <div className="absolute -bottom-8 -left-4 sm:-left-8 bg-white/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-xl border border-white flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                 <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center">
                   <ShieldCheck className="h-6 w-6 text-teal-600" />
                 </div>
                 <div>
                   <p className="font-bold text-gray-900">Scientifically Backed</p>
                   <p className="text-sm text-gray-500 font-medium">Trusted by Pediatricians</p>
                 </div>
               </div>
               
               {/* Small floating element */}
               <div className="absolute top-10 -right-6 bg-white p-3 rounded-xl shadow-lg border border-gray-100 hidden sm:flex items-center gap-2">
                 <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                 <span className="font-bold text-gray-800">4.9/5</span>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* STATS SECTION (Floating Glass Bar)        */}
      {/* ========================================= */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 -mt-8 sm:-mt-12 mb-20">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] rounded-[2rem] p-8 sm:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100/50">
            {[
              { stat: "8 Lakh+", label: "Children in Kerala" },
              { stat: "0–6 yrs", label: "Crucial Age Focus" },
              { stat: "100%", label: "Scientific Scoring" },
              { stat: "24/7", label: "Therapy Support" }
            ].map((s, i) => (
              <div key={i} className={`text-center ${i === 0 || i === 2 ? '' : ''} ${i % 2 === 0 ? 'border-none md:border-solid' : 'border-none'}`}>
                <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">{s.stat}</h3>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ========================================= */}
      {/* PROBLEM SECTION                           */}
      {/* ========================================= */}
      <section className="py-24 bg-white relative" id="features">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-bold mb-6 border border-teal-100">
            <Sparkles className="w-4 h-4" /> The Gap We Bridge
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-16 tracking-tight">Why <span className="text-indigo-600">Wings</span> exists</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Activity, title: "Missed Detection", desc: "Signs of intellectual delays are often missed simply because parents aren't aware of what to look for.", color: "text-rose-500", bg: "bg-rose-50" },
              { icon: Brain, title: "Unscientific Testing", desc: "Generic tests online fail to accurately gauge real cognitive delays, causing unnecessary panic or false comfort.", color: "text-amber-500", bg: "bg-amber-50" },
              { icon: Heart, title: "Fragmented Support", desc: "Finding the right therapies, diets, and state grants often requires visiting completely disjointed sources.", color: "text-indigo-500", bg: "bg-indigo-50" }
            ].map((item, i) => (
              <div key={i} className="group bg-white rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] text-left">
                <div className={`h-14 w-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* SOLUTION GRID                             */}
      {/* ========================================= */}
      <section className="py-24 bg-[#f8fafc] relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Everything you need,<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">In one place</span></h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">From clinical assessment to daily dietary plans, Wings supports your parenting journey completely and professionally.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              "Preliminary Assessment", "Scientific IQ Test", "Expert Consultation", "Custom Therapies",
              "Diet Planning", "Sensory Exercises", "Specialized Store", "Info & Grants Hub"
            ].map((feature, i) => (
              <div key={i} className="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 flex items-center gap-4 hover:-translate-y-1 cursor-default">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="font-bold text-gray-800 text-sm">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Start Your Journey Today
             </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default LandingPage;
