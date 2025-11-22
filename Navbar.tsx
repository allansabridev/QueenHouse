import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Home, Users, Video, Lock, Settings } from 'lucide-react';
import { useData } from '../context/DataContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAdmin, siteConfig } = useData();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path ? 'text-pink-500 font-bold drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'text-gray-400 hover:text-white transition-colors';

  const NavItems = () => (
    <>
      <Link to="/" className={`flex items-center gap-2 text-sm uppercase tracking-wider transition-all ${isActive('/')}`} onClick={() => setIsOpen(false)}>
        <Home size={16} /> {siteConfig.nav.homeLabel}
      </Link>
      <Link to="/candidates" className={`flex items-center gap-2 text-sm uppercase tracking-wider transition-all ${isActive('/candidates')}`} onClick={() => setIsOpen(false)}>
        <Users size={16} /> {siteConfig.nav.candidatesLabel}
      </Link>
      <Link to="/vote" className={`flex items-center gap-2 text-sm uppercase tracking-wider transition-all ${isActive('/vote')}`} onClick={() => setIsOpen(false)}>
        <Heart size={16} /> {siteConfig.nav.voteLabel}
      </Link>
      <Link to="/live" className={`flex items-center gap-2 text-sm uppercase tracking-wider transition-all ${isActive('/live')}`} onClick={() => setIsOpen(false)}>
        <Video size={16} /> {siteConfig.nav.liveLabel}
      </Link>
      
      {/* Admin Button */}
      {isAdmin ? (
          <Link to="/admin" className="flex items-center gap-2 text-sm uppercase tracking-wider transition-all text-green-400 hover:text-green-300 font-bold border border-green-500/30 rounded-full px-3 py-1 bg-green-500/10" onClick={() => setIsOpen(false)}>
            <Settings size={14} /> CMS
          </Link>
      ) : (
          <Link to="/login" className="flex items-center gap-2 text-sm uppercase tracking-wider transition-all text-gray-600 hover:text-pink-500 ml-2" onClick={() => setIsOpen(false)}>
            <Lock size={14} />
          </Link>
      )}
    </>
  );

  return (
    <div className="fixed top-0 w-full z-50 px-4 py-4 pointer-events-none flex justify-center">
      <nav className={`pointer-events-auto w-full max-w-5xl transition-all duration-300 rounded-2xl border border-white/10 ${scrolled ? 'liquid-glass shadow-xl bg-black/60' : 'bg-transparent border-transparent'}`}>
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link to="/" className="text-2xl font-black text-white tracking-tighter flex items-center gap-2 group">
                <span className="bg-pink-600 rounded-full w-8 h-8 flex items-center justify-center text-sm group-hover:animate-spin">👑</span>
                <span className="hidden sm:block">QUEEN <span className="text-pink-500">HOUSE</span></span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <NavItems />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden liquid-glass-strong rounded-b-2xl border-t border-white/10 overflow-hidden absolute top-full left-0 w-full mt-2">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center gap-6 py-8">
              <NavItems />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
