import React from 'react';
import { Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
        <h3 className="text-2xl font-black text-white tracking-tighter">
            QUEEN <span className="text-pink-500">HOUSE</span>
        </h3>
        <div className="flex gap-8">
            <a href="#" className="text-gray-400 hover:text-pink-500 hover:scale-110 transition-all duration-300">
                 <span className="font-bold text-sm border border-gray-600 rounded px-2 py-0.5">TikTok</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-500 hover:scale-110 transition-all duration-300">
                <Instagram size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-500 hover:scale-110 transition-all duration-300">
                <Twitter size={24} />
            </a>
        </div>
        <p className="text-xs text-gray-600">© 2024 Queen House Concept. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;