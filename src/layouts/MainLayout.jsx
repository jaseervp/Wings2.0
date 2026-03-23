import { Outlet, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col font-body">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-6 sm:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Heart className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300 fill-primary/20" />
          <span className="font-heading font-extrabold text-2xl text-primary tracking-tight">Wings</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/#features" className="hover:text-primary transition-colors">Features</Link>
          <Link to="/#testimonials" className="hover:text-primary transition-colors">Stories</Link>
          <Link to="/#pricing" className="hover:text-primary transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block font-medium hover:text-primary transition-colors">Log in</Link>
          <Link to="/register" className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5">
            Get Started Free
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 px-6 sm:px-12 border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary fill-primary/20" />
            <span className="font-heading font-bold text-xl text-primary">Wings Mental Health</span>
          </div>
          <p className="text-muted text-sm text-center md:text-left">
            © {new Date().getFullYear()} Wings Mental Health. Empowering parents, supporting children.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted hover:text-primary">Twitter</a>
            <a href="#" className="text-muted hover:text-primary">Instagram</a>
            <a href="#" className="text-muted hover:text-primary">Facebook</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
