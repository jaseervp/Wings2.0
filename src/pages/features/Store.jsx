import { useState } from 'react';
import { ShoppingCart, Search, Filter, Star, Plus, Minus, X, CreditCard } from 'lucide-react';

const PRODUCTS = [
  { id: 1, name: 'Sensory Chewy Necklace', category: 'Tools', price: 299, rating: 4.8, img: 'https://images.unsplash.com/photo-1596461404969-9ce20c718f0a?auto=format&fit=crop&q=80&w=300' },
  { id: 2, name: 'Visual Schedule Chart', category: 'Learning Aids', price: 450, rating: 4.9, img: 'https://images.unsplash.com/photo-1616628188540-9a42be4b0bd1?auto=format&fit=crop&q=80&w=300' },
  { id: 3, name: 'Weighted Blanket 2kg', category: 'Tools', price: 1299, rating: 5.0, img: 'https://images.unsplash.com/photo-1588015340628-98e6ba259928?auto=format&fit=crop&q=80&w=300' },
  { id: 4, name: 'Adaptive Puzzle Board', category: 'Toys', price: 599, rating: 4.6, img: 'https://images.unsplash.com/photo-1587654780288-63914a872652?auto=format&fit=crop&q=80&w=300' },
  { id: 5, name: 'My First Feelings Book', category: 'Books', price: 199, rating: 4.7, img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300' },
];

const CATEGORIES = ['All', 'Books', 'Toys', 'Tools', 'Learning Aids'];

const Store = () => {
  const [activeCat, setActiveCat] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const addToCart = (p) => {
    setCart([...cart, { ...p, qty: 1 }]);
    setCartOpen(true);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-heading font-extrabold text-primary mb-2">Wings Store</h2>
          <p className="text-muted font-medium text-sm">Curated tools and toys for your child's development.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => setCartOpen(true)}
            className="p-3 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-all relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
              activeCat === cat 
                ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                : 'bg-white text-muted border-gray-200 hover:border-primary/50'
            }`}
          >
            {cat}
          </button>
        ))}
        <button className="px-4 py-2.5 rounded-full text-sm font-bold text-muted bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2 border border-transparent">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {PRODUCTS.filter(p => activeCat === 'All' || p.category === activeCat).map(product => (
          <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 group flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden relative">
              <img src={product.img} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-muted uppercase tracking-wider">
                {product.category}
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-1 text-sm text-accent font-bold mb-1">
                <Star className="w-4 h-4 fill-accent" /> {product.rating}
              </div>
              <h3 className="font-bold text-text mb-2 line-clamp-2 leading-tight">{product.name}</h3>
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-xl font-heading font-black text-primary">₹{product.price}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-text/20 backdrop-blur-sm" onClick={() => setCartOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-heading font-black flex items-center gap-2">
                <ShoppingCart className="text-primary" /> Your Cart
              </h3>
              <button onClick={() => setCartOpen(false)} className="p-2 text-muted hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center text-muted font-medium py-10">Cart is empty.</div>
              ) : (
                cart.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <img src={item.img} className="w-20 h-20 rounded-xl object-cover border border-gray-100" alt="" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-text leading-tight mb-1">{item.name}</h4>
                      <div className="font-heading font-black text-primary">₹{item.price}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <button className="w-6 h-6 rounded bg-gray-100 text-muted flex items-center justify-center font-bold hover:bg-gray-200"><Minus className="w-3 h-3"/></button>
                        <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                        <button className="w-6 h-6 rounded bg-gray-100 text-muted flex items-center justify-center font-bold hover:bg-gray-200"><Plus className="w-3 h-3"/></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-muted">Subtotal</span>
                <span className="font-heading font-black text-2xl text-text">₹{total}</span>
              </div>
              <button 
                disabled={cart.length === 0}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
              >
                <CreditCard className="w-5 h-5" /> Secure Checkout
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
