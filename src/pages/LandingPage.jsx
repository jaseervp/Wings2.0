import { Link } from 'react-router-dom';
import { Brain, Heart, Activity, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-bg via-purple-50 to-primary/5 pt-24 pb-32">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
            <defs>
              <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-primary/10" fill="currentColor"></rect>
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"></rect>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              Early Detection Saves Futures
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-heading text-primary leading-tight mb-6">
              Give Your Child the <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Wings to Fly</span>
            </h1>
            <p className="text-xl text-muted mb-8 max-w-2xl font-body">
              A comprehensive, parent-centered platform for early detection, tracking, and support for children with intellectual disabilities. Assured guidance, every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link to="/register" className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 w-full sm:w-auto text-center flex items-center justify-center gap-2">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="px-8 py-4 bg-white text-primary border-2 border-primary/10 rounded-full font-bold text-lg hover:bg-gray-50 transition-all w-full sm:w-auto text-center">
                Watch Demo
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative">
             <div className="aspect-square bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl absolute inset-0"></div>
             <img src="https://images.unsplash.com/photo-1544640808-32caaefce5ed?auto=format&fit=crop&q=80&w=800" alt="Parent and child" className="relative z-10 rounded-[2rem] shadow-2xl object-cover h-[500px] w-full border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500" />
             {/* Floating badge */}
             <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-bounce">
               <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                 <ShieldCheck className="h-6 w-6 text-success" />
               </div>
               <div>
                 <p className="font-bold text-sm">Scientifically Backed</p>
                 <p className="text-xs text-muted">Trusted by Pediatricians</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <h3 className="text-4xl font-heading font-black mb-2">8 Lakh+</h3>
            <p className="text-primary-100 opacity-80">Children affected in Kerala</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-heading font-black mb-2">0–6 yrs</h3>
            <p className="text-primary-100 opacity-80">Crucial age focus</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-heading font-black mb-2">100%</h3>
            <p className="text-primary-100 opacity-80">Scientific IQ scoring</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-heading font-black mb-2">24/7</h3>
            <p className="text-primary-100 opacity-80">Therapy Support</p>
          </div>
        </div>
      </section>
      
      {/* Problem Section */}
      <section className="py-24 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-16">The Gap We Are Bridging</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Activity, title: "No Early Detection", desc: "Signs of intellectual delays are often missed simply because parents aren't aware of what to look for." },
              { icon: Brain, title: "Unscientific Testing", desc: "Generic tests online fail to accurately gauge real cognitive delays, causing unnecessary panic or false comfort." },
              { icon: Heart, title: "Fragmented Support", desc: "Finding the right therapies, diets, and state grants often requires visiting completely disjointed sources." }
            ].map((item, i) => (
              <div key={i} className="bg-bg rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 border border-secondary/10 hover:shadow-xl hover:shadow-secondary/5">
                <div className="h-16 w-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-6">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-3">{item.title}</h3>
                <p className="text-muted leading-relaxed font-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Features Grid */}
      <section className="py-24 bg-bg">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-4">Everything You Need, In One Place</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">From clinical assessment to daily dietary plans, Wings supports your parenting journey completely.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Preliminary Assessment", "Scientific IQ Test", "Expert Consultation", "Custom Therapies",
              "Diet Planning", "Sensory Exercises", "Specialized Store", "Info & Grants Hub"
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                <span className="font-bold text-text pt-0.5">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
