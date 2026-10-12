import { useState } from 'react';
import { 
  ShoppingCart, Search, Filter, Star, Plus, Minus, X, CreditCard, 
  MessageSquare, BrainCircuit, Activity, Eye, Focus, Sparkles, Bot, 
  Package, Heart, ShieldCheck, CheckCircle2, Quote
} from 'lucide-react';
import { motion } from 'framer-motion';

const PRODUCTS = [
  { id: 1, name: 'Sensory Chewy Necklace Set', category: 'Sensory Support', age: '3-8 yrs', benefits: 'Anxiety Relief, Focus', price: 299, rating: 4.8, reviews: 142, therapistApproved: true, img: 'https://images.unsplash.com/photo-1596461404969-9ce20c718f0a?auto=format&fit=crop&q=80&w=300' },
  { id: 2, name: 'Daily Visual Schedule Board', category: 'Visual Learning', age: '4-12 yrs', benefits: 'Routine Building', price: 450, rating: 4.9, reviews: 320, therapistApproved: true, img: 'https://images.unsplash.com/photo-1616628188540-9a42be4b0bd1?auto=format&fit=crop&q=80&w=300' },
  { id: 3, name: 'Calming Weighted Blanket (2kg)', category: 'Sensory Support', age: '5-10 yrs', benefits: 'Sleep Quality', price: 1299, rating: 5.0, reviews: 89, therapistApproved: true, img: 'https://images.unsplash.com/photo-1588015340628-98e6ba259928?auto=format&fit=crop&q=80&w=300' },
  { id: 4, name: 'Adaptive Motor Skills Puzzle', category: 'Fine Motor', age: '3-6 yrs', benefits: 'Pincer Grasp, Logic', price: 599, rating: 4.6, reviews: 56, therapistApproved: false, img: 'https://images.unsplash.com/photo-1587654780288-63914a872652?auto=format&fit=crop&q=80&w=300' },
  { id: 5, name: 'Emotion Recognition Flashcards', category: 'Cognitive', age: '4-9 yrs', benefits: 'Social Skills', price: 249, rating: 4.7, reviews: 210, therapistApproved: true, img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300' },
  { id: 6, name: 'Balance Stepping Stones', category: 'Gross Motor', age: '3-8 yrs', benefits: 'Coordination, Balance', price: 899, rating: 4.9, reviews: 175, therapistApproved: true, img: 'https://images.unsplash.com/photo-1544640808-32caaefce5ed?auto=format&fit=crop&q=80&w=300' },
];

const CATEGORIES = [
  { name: 'All Resources', icon: Package, active: true },
  { name: 'Speech Therapy', icon: MessageSquare, active: false },
  { name: 'Fine Motor', icon: Activity, active: false },
  { name: 'Cognitive', icon: BrainCircuit, active: false },
  { name: 'Sensory Support', icon: Sparkles, active: false },
  { name: 'Visual Learning', icon: Eye, active: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const Store = () => {
  const [activeCat, setActiveCat] = useState('All Resources');
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const addToCart = (p) => {
    const existing = cart.find(item => item.id === p.id);
    if (existing) {
      setCart(cart.map(item => item.id === p.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...p, qty: 1 }]);
    }
    setCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-6">
      
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-extrabold text-primary mb-1">Resource Center</h2>
          <p className="text-muted font-medium text-sm">Therapist-approved tools for Aarav's development</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by need (e.g., 'focus')..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm shadow-sm font-medium"
            />
          </div>
          <button 
            onClick={() => setCartOpen(true)}
            className="p-3.5 bg-white border border-gray-200 text-primary rounded-2xl hover:bg-primary/5 transition-all relative shadow-sm"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cart.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* 1. Personalized Hero */}
        <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 sm:p-10 border border-white bg-gradient-to-br from-primary to-blue-800 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -ml-20 -mb-20" />
          
          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-xs font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-300" /> Curated for Aarav
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold leading-tight">
              Tools to boost<br/>Speech & Motor Skills
            </h2>
            <p className="text-blue-100 font-medium max-w-md">
              Based on his recent assessments, we've compiled a list of highly effective resources to support his current therapy goals.
            </p>
          </div>
          
          <div className="relative z-10 flex gap-4 w-full md:w-auto">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[150px]">
              <span className="text-4xl font-heading font-black leading-tight drop-shadow-md text-yellow-300">12</span>
              <span className="text-sm font-bold opacity-90 tracking-wide mt-1 text-center">Recommended<br/>Resources</span>
            </div>
          </div>
        </motion.div>

        {/* 2 & 5. AI Recommendations & Bundles Row */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI Recommendation */}
          <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col justify-center">
            <div className="absolute -right-6 -bottom-6 opacity-5">
              <Bot className="w-48 h-48 text-indigo-600" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm border border-indigo-200">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-indigo-900">AI Care Suggestion</h3>
            </div>
            <p className="text-base text-indigo-900/80 font-medium leading-relaxed relative z-10 mb-6">
              Aarav is currently working on his pincer grasp in Occupational Therapy. The <strong>Adaptive Motor Skills Puzzle</strong> aligns perfectly with this goal.
            </p>
            <button 
              onClick={() => addToCart(PRODUCTS[3])}
              className="w-fit px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors relative z-10 shadow-md shadow-indigo-200 flex items-center gap-2"
            >
              Add Puzzle to Cart <Plus className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Development Bundle */}
          <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border border-white p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-secondary/10 to-emerald-50">
             <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <span className="inline-block px-3 py-1 bg-secondary text-white text-xs font-bold rounded-lg mb-3">Value Bundle</span>
                  <h3 className="font-heading font-bold text-xl text-text">Starter Speech Kit</h3>
                  <p className="text-sm text-muted font-medium mt-1">Flashcards, mirror tool, and guide.</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-primary">₹899</div>
                  <div className="text-xs text-muted line-through">₹1200</div>
                </div>
             </div>
             <div className="flex gap-3 mb-6 relative z-10">
                <img src={PRODUCTS[4].img} className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm" />
                <img src={PRODUCTS[1].img} className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm" />
                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-secondary/30 flex items-center justify-center text-secondary font-bold text-sm bg-white/50 backdrop-blur-sm">
                  +1
                </div>
             </div>
             <button className="w-full py-3 text-sm font-bold text-secondary bg-white border border-secondary/20 rounded-xl hover:bg-secondary/5 transition-colors relative z-10">
               View Bundle Details
             </button>
          </motion.div>
        </div>

        {/* 3. Categories */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-heading font-extrabold text-2xl text-text">Browse by Need</h3>
             <button className="flex items-center gap-2 text-sm font-bold text-muted hover:text-primary transition-colors">
               <Filter className="w-4 h-4" /> All Filters
             </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.name}
                onClick={() => setActiveCat(cat.name)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${
                  activeCat === cat.name 
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                    : 'bg-white text-muted border-gray-200 hover:border-primary/50'
                }`}
              >
                <cat.icon className="w-4 h-4" /> {cat.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 7. Product Marketplace Grid */}
        <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {PRODUCTS.filter(p => activeCat === 'All Resources' || p.category === activeCat).map(product => (
            <div key={product.id} className="glass bg-white rounded-[2rem] p-5 shadow-sm border border-white hover:shadow-xl hover:border-primary/20 transition-all duration-300 group flex flex-col h-full relative">
              
              {product.therapistApproved && (
                <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-success/20 flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  <span className="text-[10px] font-extrabold text-success uppercase tracking-wider">Approved</span>
                </div>
              )}

              <div className="aspect-[4/3] bg-gray-50 rounded-2xl mb-5 overflow-hidden relative cursor-pointer">
                <img src={product.img} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary bg-primary/5 border border-primary/10 px-2 py-1 rounded-md">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted font-bold">
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" /> {product.rating} ({product.reviews})
                  </div>
                </div>
                
                <h3 className="font-bold text-lg text-text mb-1 leading-tight group-hover:text-primary transition-colors cursor-pointer">{product.name}</h3>
                
                <p className="text-sm text-muted font-medium mb-4 flex-1">
                  Supports: <span className="text-text">{product.benefits}</span> • Ages: {product.age}
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-2xl font-heading font-black text-text">₹{product.price}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="px-4 py-2.5 bg-primary/10 text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
                  >
                    Add <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* 8. Parent Reviews */}
        <motion.div variants={itemVariants} className="mt-12">
          <h3 className="font-heading font-extrabold text-2xl text-text mb-6">Trusted by Parents</h3>
          <div className="grid md:grid-cols-2 gap-6">
             <div className="glass bg-white rounded-[2rem] p-6 sm:p-8 border border-white shadow-sm relative">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                </div>
                <p className="text-muted font-medium text-sm italic mb-6">
                  "The visual schedule board completely changed our morning routine. Aarav is much less anxious now that he can see exactly what comes next."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">P</div>
                  <div>
                    <h4 className="text-sm font-bold text-text">Priya S.</h4>
                    <p className="text-xs text-muted">Verified Buyer</p>
                  </div>
                </div>
             </div>
             
             <div className="glass bg-white rounded-[2rem] p-6 sm:p-8 border border-white shadow-sm relative">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                </div>
                <p className="text-muted font-medium text-sm italic mb-6">
                  "Dr. Menon recommended the chewy necklaces for sensory seeking, and these are by far the most durable ones we've tried. Highly recommend."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">R</div>
                  <div>
                    <h4 className="text-sm font-bold text-text">Rahul M.</h4>
                    <p className="text-xs text-muted">Verified Buyer</p>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>

      </motion.div>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-text/40 backdrop-blur-sm transition-opacity" onClick={() => setCartOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-heading font-black flex items-center gap-2 text-text">
                <ShoppingCart className="text-primary w-6 h-6" /> Your Cart
              </h3>
              <button onClick={() => setCartOpen(false)} className="p-2 text-muted hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center text-muted font-medium py-10 flex flex-col items-center">
                  <Package className="w-12 h-12 text-gray-300 mb-3" />
                  Your cart is empty.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-primary/20 transition-colors">
                    <img src={item.img} className="w-20 h-20 rounded-xl object-cover border border-gray-50 mix-blend-multiply bg-gray-50" alt="" />
                    <div className="flex-1 flex flex-col">
                      <h4 className="font-bold text-sm text-text leading-tight mb-1">{item.name}</h4>
                      <p className="text-xs text-muted mb-2">{item.category}</p>
                      <div className="mt-auto flex items-end justify-between">
                        <div className="font-heading font-black text-primary text-lg">₹{item.price}</div>
                        <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
                          <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded bg-white text-muted shadow-sm flex items-center justify-center font-bold hover:text-primary transition-colors"><Minus className="w-3.5 h-3.5"/></button>
                          <span className="text-sm font-bold w-4 text-center text-text">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded bg-white text-muted shadow-sm flex items-center justify-center font-bold hover:text-primary transition-colors"><Plus className="w-3.5 h-3.5"/></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-10">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm font-medium text-muted">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-muted">
                  <span>Shipping</span>
                  <span className="text-success font-bold">Free</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-text">Total</span>
                  <span className="font-heading font-black text-3xl text-text">₹{total}</span>
                </div>
              </div>
              <button 
                disabled={cart.length === 0}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-lg"
              >
                <CreditCard className="w-5 h-5" /> Proceed to Checkout
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
